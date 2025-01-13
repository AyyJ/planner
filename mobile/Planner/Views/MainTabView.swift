//
//  MainTabView.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import SwiftUI

struct MainTabView: View {
    @StateObject private var authViewModel = AuthViewModel()
    
    var body: some View {
        TabView {
            ArtistGridView()
                .tabItem {
                    Label("Artists", systemImage: "music.note.list")
                }
            
            Text("Schedule Coming Soon")
                .tabItem {
                    Label("Schedule", systemImage: "calendar")
                }
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person")
                }
        }
    }
}
