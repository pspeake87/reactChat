

var Messages = React.createClass({
    render: function() {
      return(

          <tr>
            <td><h5>{this.props.room.messages[0].user}</h5><br/>
            {this.props.room.messages[0].msg}</td>
            <td>{this.props.room.messages[0].time}</td>
          </tr>


      );
    }
});


var Room = React.createClass({
    render: function() {
      return ( 
        <table className="table table-striped">
          <thead>
            <tr>
              <th><h3>{this.props.room.name}</h3></th>
            </tr>
          </thead>

          <tbody>
            <Messages room={this.props.room}/>
          </tbody>
        </table>



      );
    }

});


var Chat = React.createClass({
  
  getInitialState: function() {
      return {
        rooms: [{name: "Room 1", messages: [{user: "John", msg: "how's it going?", time: "1:34 pm"}, {user: "Bob", msg: "good?", time: "1:35 pm"}, {user: "John", msg: "thats great!", time: "1:36 pm"}]}, {name: "Room 2", messages: [{user: "Phil", msg: "good", time: "1:35 pm"}]}],
        formDisplay: null,
        roomDisplay: {name: "Welcome to Chat", messages: [{user: "", msg: "", time: ""}]},
        user: null
      };
  },

  componentDidMount() {
    this.hideLightbox1();
    this.hideLightbox2();

    this.checkForUser();
  },


  checkForUser: function() {
      if (this.state.user) {

      } else {
        this.pressLightbox2On();
      }
  },

  hideLightbox1: function() {
    $('.lightbox1').hide();
    


  },

  hideLightbox2: function() {
    $('.lightbox2').hide();
    


  },

  displayRooms: function(rooms) {
      var array = [];
      for (var i = 0; i < rooms.length; i++) {

        array.push(<div onClick={this.clickHappened.bind(this, rooms[i])}>{rooms[i].name}</div>);
      }
      return array   
  },

  clickHappened: function(room) {
    this.setState({roomDisplay: room});
 
  },

  pressLightbox1On: function() {
      $('.lightbox1').css('display','block');
  },

  pressLightbox1Off: function() {
      $('.lightbox1').css('display','none');
      this.setState({formDisplay: "Enter room name here"});
  },

  pressLightbox2On: function() {
      $('.lightbox2').css('display','block');
  },

  pressLightbox2Off: function() {
      $('.lightbox2').css('display','none');
      this.setState({formDisplay: "Enter room name here"});
  },

  addRoom: function() {
      this.setState({ 
          rooms: this.state.rooms.concat({name: this.state.formDisplay, messages: [{user: "", msg: "", time: ""}]})
      });
      $('.lightbox1').css('display','none');
      this.setState({formDisplay: null});
    
  },

  addUser: function() {
      this.setState({ 
          user: this.state.formDisplay
      });
      $('.lightbox2').css('display','none');
      this.setState({formDisplay: null});
    
  },

  handleChange: function(event) {
    this.setState({formDisplay: event.target.value});
  },



  render: function() {
    return <div>
      <div className="col-sm-4">

         <table className="table">
          <tbody>
           <tr>
              <td><h2>Bloc Chat</h2></td>
              <td className="btnContainer"><button type="button" className="btn" onClick={this.pressLightboxOn}>New Room</button></td>
           </tr>
          </tbody>
         </table>

          {this.displayRooms(this.state.rooms)}
        
        </div>

      <div className="col-sm-8">
         <Room room={this.state.roomDisplay}/>
      </div>

      <div className="lightbox1">
            <div className="newRoomForm">
            <h3>Create a Room</h3>
            Enter Room Name Here
             <input type="text" value={this.state.formDisplay} onChange={this.handleChange}/><br/><br/>
             <button className="btn" onClick={this.pressLightbox1Off}>Cancel</button><button className="btn" onClick={this.addRoom}>Submit</button>
            </div>
      </div>
      <div className="lightbox2">
            <div className="newUserForm">
            <h3>Create a Room</h3>
            Enter User Name Here
             <input type="text" value={this.state.formDisplay} onChange={this.handleChange}/><br/><br/>
             <button className="btn" onClick={this.addUser}>Submit</button>
            </div>
      </div>

    </div>;
    
  }
});

ReactDOM.render(
  <Chat />,
  document.getElementById('container')
);