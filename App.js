import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import NavBar from './Navbar'
import { StyleSheet, View, BackHandler, ActivityIndicator } from 'react-native'
var dateFormat = require('dateformat');

const apiUrl = 'https://api-hospital-tracker.herokuapp.com';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);


  const _hospitals = async () => {
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/api/v1/chatbot/`, {
        method: 'GET'
      }
    )
    const result = await response.json()
    setLoading(false);
  } 


  const _findNearby = async (location, kilometer = 10) => {
    const response = await fetch(
      `${apiUrl}/api/v1/chatbot/find_nearby/?location=${location}&kilometer=${kilometer}`, {
        method: 'GET',
      }
    )
    const result = await response.json()
    if (result.length > 0) {
      let dateToday = new Date();
      setMessages(previousMessages => GiftedChat.append(previousMessages, [
        {
          _id: Math.floor(Math.random() * 100000),
          text: `as of ${dateFormat(dateToday, 'mmmm dS, yyyy')}, here are the hospitals with available bed capacity (icu or isolation(Covid) wards)`
        }
      ]))
      for(var i = 0; i<result.length; i++) {
        setMessages(previousMessages => GiftedChat.append(previousMessages, [
          {
            _id: Math.floor(Math.random() * 10000000),
            text: 
`${result[i].name}
ICU Beds Available: ${result[i].icu_beds}
Covid Wards Available: ${result[i].isolation_beds}
Contact Person: ${result[i].contact_person != null ? result[i].contact_person : 'John Doe'}
Contact Number: ${result[i].primary_contact_number}
Location: ${result[i].gmaps_link}`,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'Bed Trace',
              avatar: require('./assets/logo.png')
            }
          }
        ]))
      }
    } else {
      setMessages(previousMessages => GiftedChat.append(previousMessages, [
        {
          _id: Math.floor(Math.random() * 10000000),
          text: `There is no nearby hospital within your area`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Bed Trace',
            avatar: require('./assets/logo.png')
          }
        }
      ]))
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, [
      {
        _id: Math.floor(Math.random() * 10000000),
        text: 'Do you still wanna communicate with bed trace? If yes choose check for nearby hospitals, else choose end.',
        createdAt: new Date(),
        quickReplies: {
          type: 'radio', // or 'checkbox',
          keepIt: false,
          values: [
            {
              title: 'Check for nearby Hospitals',
              value: 'nearby',
            },
            {
              title: 'End',
              value: 'end',
            },
          ],
        },
        user: {
          _id: 2,
          name: 'Bed Trace',
          avatar: require('./assets/logo.png')
        },
      }
    ]))
  }

  useEffect(() => {
    _hospitals();
    setMessages([
      {
        _id: 1,
        text: 'What is your current location?',
        createdAt: new Date(),
        
        user: {
          _id: 2,
          name: 'Bed Trace',
          avatar: require('./assets/logo.png')
        },
      },    
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    const location = messages[0].text.replace(',', '');
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    setMessages(previousMessages => GiftedChat.append(previousMessages, [
      {
        _id: Math.floor(Math.random() * 10000000),
        text: 'Tracking Nearby Hospitals Based on Location provided.....',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bed Trace',
          avatar: require('./assets/logo.png')
        }
      }
    ]))
    _findNearby(location)
  }, [])

  const onQuickReply = replies => {
    if(replies[0].value == 'nearby') {
      setMessages(previousMessages => GiftedChat.append(previousMessages, 
        [
          {
            _id: Math.floor(Math.random() * 1000000),
            text: 'What is your current location?',
            createdAt: new Date(),
            
            user: {
              _id: 2,
              name: 'Bed Trace',
              avatar: require('./assets/logo.png')
            },
          },    
        ]
      ))
    } else {
      setMessages(previousMessages => GiftedChat.append(previousMessages, 
        [
          {
            _id: Math.floor(Math.random() * 1000000),
            text: 'Bed Trace will close in a bit.. Thank you for using Bed Trace!',
            createdAt: new Date(),
            
            user: {
              _id: 2,
              name: 'Bed Trace',
              avatar: require('./assets/logo.png')
            },
          },    
        ]
      )) 
      setTimeout(() => {
        BackHandler.exitApp();
      }, 2000)
    }
  };


  return (
    <>
    {
      loading ? ( 
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View> ) : (
        <View
        style={styles.container}>
          <NavBar />
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            onQuickReply={onQuickReply}
            user={{
              _id: 1,
            }}
          />
        </View>
      ) 
    }
    </>
  );
}



const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  },
  container: { flex: 1 },
})

