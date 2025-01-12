//
//  User.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

struct User: Identifiable, Codable {
    let id: String
    let username: String
    var artistPreferences: [String: InterestLevel] // [ArtistID: InterestLevel]
}
