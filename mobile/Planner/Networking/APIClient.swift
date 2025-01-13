//
//  APIClient.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

class APIClient {
    static let shared = APIClient()
    private init() {}
    
    var authToken: String? {
        get { UserDefaults.standard.string(forKey: "authToken") }
        set { UserDefaults.standard.set(newValue, forKey: "authToken") }
    }
    
    // MARK: - Configuration
    private struct APIConfig {
        static let baseURL = "http://localhost:3000/api/v1"
        static let timeout: TimeInterval = 30
        
        enum Endpoints {
            static let login = "/auth/login"
            static let register = "/auth/register"
            static let logout = "/auth/logout"
            static let artists = "/artists"
            static let artistPreference = "/artists/%@/preference" // %@ will be replaced with artistId
        }
    }
    
    // MARK: - Network Request
    func makeRequest<T: Codable>(
        endpoint: String,
        method: String = "GET",
        body: [String: Any]? = nil
    ) async throws -> T {
        APILogger.log(.debug, "Starting \(method) request to \(endpoint)")
        
        guard let url = URL(string: APIConfig.baseURL + endpoint) else {
            APILogger.log(.error, "Invalid URL: \(APIConfig.baseURL + endpoint)")
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.timeoutInterval = APIConfig.timeout
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            APILogger.log(.debug, "Added auth token to request")
        }
        
        if let body = body {
            do {
                request.httpBody = try JSONSerialization.data(withJSONObject: body)
                APILogger.log(.debug, "Request body: \(body)")
            } catch {
                APILogger.log(.error, "Failed to serialize request body", error: error)
                throw APIError.unknown(error)
            }
        }
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                APILogger.log(.error, "Invalid response type")
                throw APIError.serverUnreachable
            }
            
            // Log response details
            APILogger.log(.info, """
                Response received:
                Status Code: \(httpResponse.statusCode)
                Headers: \(httpResponse.allHeaderFields)
                Data length: \(data.count) bytes
                """)
            
            // Log response body in debug builds
            #if DEBUG
            if let jsonString = String(data: data, encoding: .utf8) {
                APILogger.log(.debug, "Response body: \(jsonString)")
            }
            #endif
            
            switch httpResponse.statusCode {
            case 200...299:
                do {
                    let decoder = JSONDecoder()
                    decoder.keyDecodingStrategy = .convertFromSnakeCase
                    return try decoder.decode(T.self, from: data)
                } catch {
                    APILogger.log(.error, "Decoding error", error: error)
                    throw APIError.decodingError(error)
                }
            case 401:
                throw APIError.unauthorized
            case 400...499:
                let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data)
                throw APIError.serverError(message: errorResponse?.message ?? "Client error")
            case 500...599:
                throw APIError.serverError(message: "Server error")
            default:
                throw APIError.unknown(URLError(.badServerResponse))
            }
            
        } catch let urlError as URLError {
            APILogger.log(.error, "Network error", error: urlError)
            
            if urlError.code == .cannotConnectToHost {
                throw APIError.serverUnreachable
            }
            throw APIError.networkError(urlError)
            
        } catch {
            APILogger.log(.error, "Unknown error", error: error)
            throw APIError.unknown(error)
        }
    }
    
    // MARK: - Auth Endpoints
    func login(username: String, password: String) async throws -> AuthResponse {
        let body: [String: Any] = [
            "username": username,
            "password": password
        ]
        
        let response: AuthResponse = try await makeRequest(
            endpoint: APIConfig.Endpoints.login,
            method: "POST",
            body: body
        )
        
        self.authToken = response.token
        return response
    }
    
    func register(username: String, password: String) async throws -> AuthResponse {
        let body: [String: Any] = [
            "username": username,
            "password": password
        ]
        
        let response: AuthResponse = try await makeRequest(
            endpoint: APIConfig.Endpoints.register,
            method: "POST",
            body: body
        )
        
        self.authToken = response.token
        return response
    }
    
    func logout() async throws {
        let _: EmptyResponse = try await makeRequest(
            endpoint: APIConfig.Endpoints.logout,
            method: "POST"
        )
        self.authToken = nil
    }
    
    // MARK: - Artist Endpoints
    func fetchArtists() async throws -> [Artist] {
        return try await makeRequest(
            endpoint: APIConfig.Endpoints.artists,
            method: "GET"
        )
    }
    
    func setArtistPreference(
        artistId: String,
        interestLevel: InterestLevel
    ) async throws -> User {
        let body: [String: Any] = [
            "interestLevel": interestLevel.rawValue
        ]
        
        return try await makeRequest(
            endpoint: "\(APIConfig.Endpoints.artists)/\(artistId)/preference",
            method: "POST",
            body: body
        )
    }
}
