//
//  ArtistViewModel.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import SwiftUI

@MainActor
class ArtistViewModel: ObservableObject {
    @Published var artists: [Artist] = []
    @Published var preferences: [String: InterestLevel] = [:]
    @Published var isLoading = false
    @Published var error: Error?
    @Published var sortOption: SortOption = .name {
        didSet {
            sortArtists()
        }
    }
    
    enum SortOption {
        case name
        case genre
        case stage
    }
    
    private func sortArtists() {
        artists.sort { first, second in
            switch sortOption {
            case .name:
                return first.name < second.name
            case .genre:
                return first.genre < second.genre
            case .stage:
                return first.stage.rawValue < second.stage.rawValue
            }
        }
    }
    
    func loadArtists() async {
        isLoading = true
        
        do {
            artists = try await APIClient.shared.fetchArtists()
            // Load user preferences
            if let user = AppState.shared.currentUser {
                preferences = user.artistPreferences
            }
            sortArtists()
            error = nil
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func setPreference(for artist: Artist, level: InterestLevel) {
        Task {
            do {
                let updatedUser = try await APIClient.shared.setArtistPreference(
                    artistId: artist.id,
                    interestLevel: level
                )
                preferences = updatedUser.artistPreferences
                AppState.shared.currentUser = updatedUser
                error = nil
            } catch {
                self.error = error
            }
        }
    }
}
