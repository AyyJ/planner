//
//  Artist.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

struct Artist: Identifiable, Codable {
    let id: String
    let name: String
    let imageURL: String?
    let genre: String
    let stage: Stage
}
