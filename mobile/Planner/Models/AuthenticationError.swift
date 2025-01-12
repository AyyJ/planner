//
//  AuthenticationError.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

enum AuthenticationError: LocalizedError {
    case invalidCredentials
    case registrationFailed(message: String)
    case networkError
    case unknown
    
    var errorDescription: String? {
        switch self {
        case .invalidCredentials:
            return "Incorrect username or password"
        case .registrationFailed(let message):
            return "Registration failed: \(message)"
        case .networkError:
            return "Unable to connect. Please check your internet connection"
        case .unknown:
            return "An unexpected error occurred. Please try again"
        }
    }
}
