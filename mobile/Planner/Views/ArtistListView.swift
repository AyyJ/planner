//
//  ArtistListView.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import SwiftUI

struct ArtistListView: View {
    @State private var artists: [Artist] = []
    
    var body: some View {
        NavigationView {
            List(artists) { artist in
                VStack(alignment: .leading) {
                    Text(artist.name)
                        .font(.headline)
                    Text(artist.genre)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }
            }
            .navigationTitle("Artists")
            .task {
                do {
                    artists = try await NetworkManager.shared.fetchArtists()
                } catch {
                    print("Error fetching artists: \(error)")
                }
            }
        }
    }
}
