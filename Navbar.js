import React from 'react'
import { Text, Platform, SafeAreaView, StyleSheet } from 'react-native'
import NavBar, { NavTitle, NavButton } from 'react-native-nav'

export default function NavBarCustom() {
  if (Platform.OS === 'web') {
    return null
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#f5f5f5' }}>
      <NavBar>
        <NavButton />
        <NavTitle style={styles.navtitle}>
          💬 Bed Trace
        </NavTitle>
        <NavButton />
      </NavBar>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    navtitle: { fontSize: 28 },
  })
  