//
//  ArtistCardView.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import SwiftUI

struct ArtistCardView: View {
    let artist: Artist
    let selectedInterest: InterestLevel?
    var onPreferenceSelected: (InterestLevel) -> Void
    
    var body: some View {
        VStack {
            // Artist Image or Placeholder
            ZStack {
                if let imageURL = artist.imageURL,
                   let url = URL(string: imageURL) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        ProgressView()
                    }
                } else {
                    Rectangle()
                        .fill(Color.gray.opacity(0.3))
                        .overlay {
                            Image(systemName: "music.mic")
                                .font(.system(size: 30))
                                .foregroundColor(.gray)
                        }
                }
            }
            .frame(height: 120)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            
            // Artist Info
            VStack(alignment: .leading, spacing: 4) {
                Text(artist.name)
                    .font(.headline)
                    .lineLimit(1)
                
                Text(artist.genre)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .lineLimit(1)
                
                // Interest Level Selector
                Menu {
                    ForEach(InterestLevel.allCases, id: \.self) { level in
                        Button {
                            onPreferenceSelected(level)
                        } label: {
                            HStack {
                                Text(level.rawValue)
                                if level == selectedInterest {
                                    Image(systemName: "checkmark")
                                }
                            }
                        }
                    }
                } label: {
                    HStack {
                        Text(selectedInterest?.rawValue ?? "Set Interest")
                            .foregroundColor(selectedInterest == nil ? .blue : .white)
                        Spacer()
                        Image(systemName: "chevron.up.chevron.down")
                            .foregroundColor(selectedInterest == nil ? .blue : .white)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(selectedInterest == nil ? .clear : .blue)
                    .cornerRadius(5)
                    .overlay(
                        RoundedRectangle(cornerRadius: 5)
                            .stroke(Color.blue, lineWidth: selectedInterest == nil ? 1 : 0)
                    )
                }
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
        .padding(.vertical, 4)
    }
}
