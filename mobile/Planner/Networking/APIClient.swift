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
        
        enum Endpoints {
            static let login = "/auth/login"
            static let register = "/auth/register"
            static let logout = "/auth/logout"
            static let artists = "/artists"
        }
    }
    
    // MARK: - Network Request
    func makeRequest<T: Codable>(
        endpoint: String,
        method: String = "GET",
        body: [String: Any]? = nil
    ) async throws -> T {
        guard let url = URL(string: APIConfig.baseURL + endpoint) else {
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        if let body = body {
            let jsonData = try JSONSerialization.data(withJSONObject: body)
            request.httpBody = jsonData
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.networkError
        }
        
        switch httpResponse.statusCode {
        case 200...299:
            do {
                return try JSONDecoder().decode(T.self, from: data)
            } catch {
                print("Decoding error: \(error)")
                throw APIError.decodingError
            }
        case 401:
            throw APIError.unauthorized
        case 400...499:
            let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data)
            throw APIError.serverError(message: errorResponse?.message ?? "Client error")
        case 500...599:
            throw APIError.serverError(message: "Server error")
        default:
            throw APIError.unknown
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

enum APIError: Error {
    case invalidURL
    case networkError
    case decodingError
    case unauthorized
    case serverError(message: String)
    case unknown
    
    var userMessage: String {
        switch self {
        case .invalidURL:
            return "Invalid request"
        case .networkError:
            return "Network error. Please check your connection"
        case .decodingError:
            return "Error processing server response"
        case .unauthorized:
            return "Please log in again"
        case .serverError(let message):
            return message
        case .unknown:
            return "An unexpected error occurred"
        }
    }
}
