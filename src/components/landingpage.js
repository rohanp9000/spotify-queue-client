import React, { Component, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap'
import '../App.css';

import SpotifyWebApi from 'spotify-web-api-js';
//import  refreshTokens  from './authorization-script' 
const spotifyApi = new SpotifyWebApi();


class LandingPage extends Component {


    constructor(){
        super();
        this.state = {
            loggedIn: false,
            access_token: '',
            refresh_token: '',
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            toQueue: { name: '', albumArt: '', uri: ''},
            showSongToUser: false,

        }
        this.updateInputValue = this.updateInputValue.bind(this);
        this.findSong = this.findSong.bind(this);
        this.queueSong = this.queueSong.bind(this);
        this.resetQueueState = this.resetQueueState.bind(this)
    }

    async getTokens(){
        var tokens = {};
        await fetch('https://sptfy-queue-api.herokuapp.com/api/tokens/5f304d0f77cf3c0017ece550')
        .then(response => response.json())
        .then(data =>{
            try{
                tokens['access_token'] = data.data.auth_token;
                tokens['refresh_token'] = data.data.refresh_token;
                this.setState({
                    loggedIn: true,
                    access_token: data.data.auth_token,
                    refresh_token: data.data.refresh_token,

                })

                if(this.state.access_token){
                    spotifyApi.setAccessToken(this.state.access_token)
                }

            }catch (error){
            console.log(error)
            }
        });    
          
    }

    getNowPlaying(){
        spotifyApi.getMyCurrentPlaybackState()
          .then((response) => {
            try{
            this.setState({
              nowPlaying: { 
                  name: response.item.name, 
                  albumArt: response.item.album.images[0].url
                }
                
            });
          }catch (error) {
            this.setState({
              nowPlaying: { 
                name: 'No song currently playing', 
                albumArt: ''
              }
            })
          }
          })
      
      }

      findSong(){
          var query = this.state.toQueue.name;
          var options = {
              "market": "US",
              "limit": "1"
          }
          spotifyApi.searchTracks(query, options)
          .then((response) => {
              try{
                console.log(response.tracks.items[0].album.images[0]);
              this.setState({
                toQueue: {
                    name: response.tracks.items[0].name,
                    albumArt: response.tracks.items[0].album.images[0].url,
                    uri: response.tracks.items[0].uri
                },
                showSongToUser: true,
                
              })
              } catch(error){
                  console.log(error)
              }
          })
      }

      async queueSong(){
   
          var url = 'https://api.spotify.com/v1/me/player/queue';
          var params = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.access_token
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                'uri': this.state.toQueue.uri    
            })
        }
        console.log(params);
          await fetch(url, params).then(response => {
            console.log(response.json());
        });

          this.setState({
              showSongToUser: false,
              toQueue: {
                  name: '',
                  albumArt: '',
                  uri: '',
              }
          })
      }

      resetQueueState(){
        this.setState({
          showSongToUser: false,
          toQueue: {
              name: '',
              albumArt: '',
              uri: '',
          }
      })
      }

      updateInputValue(value) {
        this.setState({
          toQueue: {
            name: value.target.value
          }
        });
      }
    
    render () {
        return(
        <div className='App'>
    { this.state.loggedIn &&

        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
    }
        { this.state.loggedIn &&

        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
    }
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }    
        { !this.state.loggedIn &&
          <button onClick={() => this.getTokens()}>
            Get Token
          </button>
        } 
        { this.state.loggedIn &&
            <div>
            <input type="text" value={this.state.toQueue.name} onChange={this.updateInputValue}/>

            <button type="button" onClick={this.findSong} className="btn">Queue</button>
            </div>
        }       

        {/* { this.state.showSongToUser &&
        <div>
        <div>
            Would you like to queue: { this.state.toQueue.name }
        </div>
        <div>
        <img src={this.state.toQueue.albumArt} style={{ height: 150 }}/>
        </div>

        </div>
} */}
    { this.state.showSongToUser &&
    <Modal.Dialog>
    <Modal.Header closeButton>
        <Modal.Title>Queue Song</Modal.Title>
    </Modal.Header>

    <Modal.Body>
    <p>Would you like to queue: { this.state.toQueue.name }</p>
    <img src={this.state.toQueue.albumArt} style={{ height: 150 }}/>

    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={this.resetQueueState}>No</Button>
        <Button variant="primary" onClick={this.queueSong}>Yes, Queue</Button>
    </Modal.Footer>
    </Modal.Dialog>

    }

        </div>
        )
    }
}
export default LandingPage;