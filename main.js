

var Messages = React.createClass({
    render: function() {
      return(

          <tr>
            <td className="message"><h5 className="user">{this.props.room.user}</h5>
            {this.props.room.msg}</td>
            <td>{this.props.room.time}</td>
          </tr>


      );
    }
});


var Room = React.createClass({

  renderMessages: function() {
    
      var array = [];
      for (var i = 0; i < this.props.room.messages.length; i++) {
          array.push(<Messages room={this.props.room.messages[i]}/>);
      }
      return array
   
  },
    render: function() {
      return ( 
        <table className="table table-striped">
          <thead>
            <tr>
              <th><h3>{this.props.room.name}</h3></th>
            </tr>
          </thead>

          <tbody>
            {this.renderMessages()}
          </tbody>
        </table>



      );
    }

});


var Chat = React.createClass({
  mixins: [ReactFireMixin],
 

  getInitialState: function() {
      

      return {
        rooms: [],
        formDisplay: null,
        roomDisplay: null,
        user: null,
        message: "",
        reRender: "",
        currentDisplay: null
      
        
      };
  },

  componentWillMount: function() {
   var ref = new Firebase("https://g20ie61vavx.firebaseio-demo.com/reactChat/rooms");
   this.bindAsArray(ref, "rooms");
   
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

  addMessage: function() {
    //current time
    var d = new Date().toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric"});
    //add message to room
    
    this.state.rooms[this.state.currentDisplay].messages.push({user: this.state.user, msg: this.state.message, time: d});
    
    var ref = new Firebase("https://g20ie61vavx.firebaseio-demo.com/reactChat/rooms");
    
    var onComplete = function(error) {
        if (error) {
          this.state.roomDisplay.messages.push({user: "Admin", msg: "Your message recieved an error", time: d});
        } else {
          console.log('Synchronization succeeded');
        }
      };

    if (this.state.roomDisplay[".key"]) {
        var x = ref.child(this.state.rooms[this.state.currentDisplay][".key"]);
        var y = x.child("messages");
        y.set(this.state.rooms[this.state.currentDisplay].messages, onComplete)
        
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

        array.push(<div className="roomLink" onClick={this.clickHappened.bind(this, i)}>{rooms[i].name}</div>);
      }
      return array   
  },

  clickHappened: function(num) {
    this.setState({roomDisplay: this.state.rooms[num]});
    this.setState({currentDisplay: num});
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
     

      var ref = new Firebase("https://g20ie61vavx.firebaseio-demo.com/reactChat/rooms");
      ref.push({name: this.state.formDisplay, messages: [{user: "Admin", msg: "Welcome to " + this.state.formDisplay, time: ""}]});

      //remove lightbox
      $('.lightbox1').css('display','none');
      this.setState({formDisplay: null});
    
  },

  addUser: function() {
      if (this.state.formDisplay == null) {
      return;
      }
      this.setState({ 
          user: this.state.formDisplay
      });

      
      $('.lightbox2').css('display','none');
      this.setState({formDisplay: null});
    
  },

  handleChange: function(event) {
    this.setState({formDisplay: event.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var message = this.state.message.trim();
    if (!message) {
      return;
    }
    this.addMessage();
    // send to firebase
    this.setState({message: ''});
  },

  handleTextChange: function(e) {
    this.setState({message: e.target.value});
  },

  openScreen: function() {
    if (this.state.roomDisplay == null) {
      return <h3>Welcome to React Chat</h3>
    } else {

      return <Room room={this.state.rooms[this.state.currentDisplay]}/>
    }
  },



  render: function() {
    return <div>
      <div className="col-sm-4">

         <table className="table">
          <tbody>
           <tr>
              <td><h2>React- Chat</h2></td>
              <td className="btnContainer"><button type="button" className="btn" onClick={this.pressLightbox1On}>New Room</button></td>
           </tr>
          </tbody>
         </table>

          {this.displayRooms(this.state.rooms)}
        
        </div>

      <div className="col-sm-8">
         {this.openScreen()}
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
            <h3>Create a Username</h3>
            Enter User Name Here
             <input type="text" value={this.state.formDisplay} onChange={this.handleChange}/><br/><br/>
             <button className="btn" onClick={this.addUser}>ok</button>
            </div>
      </div>

      <form className="chatInput" onSubmit={this.handleSubmit}>
      <input className="chat" type="text" maxLength={100} placeholder=" Enter Your Message Here" value={this.state.message} onChange={this.handleTextChange} /><input className="submit" type="submit" value="Send" />
      </form>

    </div>;
    
  }
});

ReactDOM.render(
  <Chat />,
  document.getElementById('container')
);