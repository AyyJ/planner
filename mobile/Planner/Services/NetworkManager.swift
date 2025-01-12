//
//  NetworkManager.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

class NetworkManager {
    static let shared = NetworkManager()
    private init() {}
    
    private let baseURL = "https://api.yourbackend.com/v1"  // You'll change this later
    
    func fetchArtists() async throws -> [Artist] {
        // This is a temporary mock implementation
        return [
            Artist(id: "1", name: "Artist 1", imageURL: nil, genre: "Pop"),
            Artist(id: "2", name: "Artist 2", imageURL: nil, genre: "Rock")
        ]
    }
}
