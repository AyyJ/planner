//
//  RootView.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import SwiftUI

struct RootView: View {
    @StateObject private var appState = AppState.shared
    
    var body: some View {
        Group {
            if appState.currentUser != nil {
                MainTabView()
            } else {
                LoginView()
            }
        }
        .overlay {
            if appState.isLoading {
                ProgressView()
                    .background(.ultraThinMaterial)
            }
        }
        .alert("Error", isPresented: .constant(appState.error != nil)) {
            Button("OK") {
                appState.error = nil
            }
        } message: {
            if let error = appState.error {
                Text(error)
            }
        }
    }
}
