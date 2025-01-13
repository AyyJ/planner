//
//  ArtistGridView.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import SwiftUI

struct ArtistGridView: View {
    @StateObject private var viewModel = ArtistViewModel()
    @Environment(\.horizontalSizeClass) private var sizeClass
    
    private let gridItems = [
        GridItem(.adaptive(minimum: 160, maximum: 200), spacing: 16)
    ]
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: gridItems, spacing: 16) {
                    ForEach(viewModel.artists) { artist in
                        ArtistCardView(
                            artist: artist,
                            selectedInterest: viewModel.preferences[artist.id],
                            onPreferenceSelected: { interest in
                                viewModel.setPreference(for: artist, level: interest)
                            }
                        )
                    }
                }
                .padding()
            }
            .navigationTitle("Artists")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Picker("Sort by", selection: $viewModel.sortOption) {
                            Text("Name").tag(ArtistViewModel.SortOption.name)
                            Text("Genre").tag(ArtistViewModel.SortOption.genre)
                            Text("Stage").tag(ArtistViewModel.SortOption.stage)
                        }
                    } label: {
                        Image(systemName: "arrow.up.arrow.down")
                    }
                }
            }
            .refreshable {
                await viewModel.loadArtists()
            }
            .overlay {
                if viewModel.isLoading {
                    ProgressView()
                }
            }
            .alert(
                "Error",
                isPresented: Binding(
                    get: { viewModel.error != nil },
                    set: { if !$0 { viewModel.error = nil } }
                ),
                actions: {
                    Button("OK") {
                        viewModel.error = nil
                    }
                },
                message: {
                    if let error = viewModel.error as? APIError {
                        Text(error.userMessage)
                    } else {
                        Text(viewModel.error?.localizedDescription ?? "Unknown error")
                    }
                }
            )
            .task {
                await viewModel.loadArtists()
            }
        }
    }
}
