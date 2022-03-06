import React from 'react';
import { Typography, Divider } from '@material-ui/core'; 
import { Link } from 'react-router-dom';
import './userPhotos.css';
import axios from 'axios';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);    
    // newComments will store an array of newComments to add, one for each photo
    this.state = { photos: undefined, user: undefined, newComments: undefined };

    this.handleNewComment = this.handleNewComment.bind(this);
    this.submitNewComment = this.submitNewComment.bind(this);
  }

  render() {
    // If promise not returned, return nothing
    if(this.state.photos === undefined || this.state.user === undefined)
    {
      return (<div/>);
    }
    
    return (
      <div>
        {this.state.photos.map((photo, i) => {
          if(photo === undefined) return (<div/>);

          return (
          <div className="cs142-photo-box" key={photo._id}>
            <Typography variant="subtitle2">{photo.date_time.substr(0,10)}</Typography>
            <img src={`../../images/${photo.file_name}`} className="cs142-photo"/>
            {this.renderComments(photo)}
            <form onSubmit={event => this.submitNewComment(event, i, photo._id)}>
              <label htmlFor="newComment">
                Add a new comment: <input type="text" value={this.state.newComments[i]} onChange={event => this.handleNewComment(event, i)} />
              </label>
              <input type="submit" value="Add comment"/>
            </form>            
          </div>
          );       
        })}        
      </div>
    );
  }

  renderComments(photo) {
    if(this.state.photos === undefined) return (<div/>);
    
    if(photo.comments === undefined) return (<div/>);

    return (
      photo.comments.map(comment => {
        let name = comment.user.first_name + " " + comment.user.last_name;
        return (
          <div className="cs142-comment" key={comment._id}>            
            <Link to={`/users/${comment.user._id}`} key={comment.user._id} replace>
              <Typography variant="subtitle2">{name} </Typography>
            </Link>            
            <Typography variant="subtitle2">{comment.comment} </Typography>
            <Typography variant="subtitle2">{comment.date_time.substr(0,10)}</Typography>
            <Divider/>
          </div>
        );
      })
    );    
  }

  submitNewComment(event, i, photo_id) {
    console.log("UserPhotos | SubmitNewComment called on photo index: " + i +
      ". With photo_id: " + photo_id);    
    
    event.preventDefault(); // Stop DOM from generating a POST 

    var promise = axios.post("/commentsOfPhoto/" + photo_id, {comment: this.state.newComments[i]});
    promise.then(response => {
      console.log("UserPhotos | Comment added successfully for photo index: " + i +
        ". With response: " + response);
      
      // Reset the comment to an empty string, updating state & re-rendering
      var newCommentsCopy = JSON.parse(JSON.stringify(this.state.newComments));
      newCommentsCopy[i] = "";
      this.setState({newComments: newCommentsCopy});
      this.fetchModel(true);
    })
    .catch(error => {
      console.error("UserPhotos | Comment creation unsuccessful for photo index: " + i + 
        ". Error: " + error);
    });
  }

  handleNewComment(event, i) {    
    console.log("UserPhotos | HandleNewComment on photo index: " + i);

    var newCommentsCopy = JSON.parse(JSON.stringify(this.state.newComments));
    newCommentsCopy[i] = event.target.value;
    this.setState({newComments: newCommentsCopy});
  }

  fetchModel(newComment) {
    // Unless there's a newComment, avoid an infinite loop by checking the user is new
    if(!newComment && (this.props.match.params.userId === this.state.user?._id)) return;
    
    var promise = axios.get("/photosOfUser/" + this.props.match.params.userId);
    promise.then(response => {        
      var newComments = new Array(response.data.length);
      this.setState({photos: response.data, newComments: newComments}); 
      })
      .catch(err => console.error(err));
      
    promise = axios.get("/user/" + this.props.match.params.userId);
    promise.then(response => {
        this.setState({user: response.data});
        this.props.updateCurrentView("Photos of user: " + this.state.user.first_name + " " + this.state.user.last_name);
      })
      .catch(err => console.error(err));// If promise hasn't returned, return nothing
  }

  // Update the view context
  componentDidMount()
  {
    this.fetchModel(false);
  }

  componentDidUpdate() {
    this.fetchModel(false);
  }
}

export default UserPhotos;