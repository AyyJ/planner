//
//  APIError.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

enum APIError: LocalizedError {
    case invalidURL
    case networkError(URLError)
    case serverUnreachable
    case decodingError(Error)
    case unauthorized
    case serverError(message: String)
    case unknown(Error)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL. Please contact support."
        case .networkError(let urlError):
            switch urlError.code {
            case .notConnectedToInternet:
                return "No internet connection. Please check your connection and try again."
            case .timedOut:
                return "Request timed out. Please try again."
            case .cannotConnectToHost:
                return "Cannot connect to server. Please try again later."
            default:
                return "Network error: \(urlError.localizedDescription)"
            }
        case .serverUnreachable:
            return "Cannot reach the server. Please make sure the server is running and try again."
        case .decodingError:
            return "Error processing server response. Please try again."
        case .unauthorized:
            return "Please login again to continue."
        case .serverError(let message):
            return message
        case .unknown:
            return "An unexpected error occurred. Please try again."
        }
    }
    
    var userMessage: String {
        return errorDescription ?? "An unknown error occurred"
    }
}
