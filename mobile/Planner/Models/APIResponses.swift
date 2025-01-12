//
//  APIResponses.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

struct AuthResponse: Codable {
    let user: User
    let token: String
}

struct ErrorResponse: Codable {
    let message: String
}

struct EmptyResponse: Codable {}
