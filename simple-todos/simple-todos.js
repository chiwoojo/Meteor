Tasks = new Mongo.Collection("tasks");


if (Meteor.isClient) {
  //this code only runs on the client
  Template.body.helpers({
    tasks: function() {
    	if (Session.get("hideCompleted")) {
        //if hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        //Otherwise, return all of the tasks
        return Tasks.find({},{sort: {createdAt: -1}});
      }
    },
    hideCompleted : function() {
      return Session.get("hideCompleted");
    },
    incompleteCount: function() {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  //adding events to the HTML template
  Template.body.events({

    /*
      this looks out for 'submit' event within .new-task class. 
    */
  	"submit .new-task": function(event) {
  		//prevent default browser form submit
  		event.preventDefault();

  		//get value from form element
  		var text = event.target.text.value;

  		//Insert a task into the database collection
  		Tasks.insert({
  			text: text,
  			createdAt: new Date()
  		});

  		//clear form
  		event.target.text.value = "";
  	},

    /*
      This looks for a 'change' in .hide-complete checkbox
    */
    "change .hide-completed": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }

  });

  Template.task.events({
  	"click .toggle-checked": function() {
  		//set the checked property to the opposite of its current value
  		Tasks.update(this._id, {
  			$set: {checked: ! this.checked}
  		});
  	},
  	"click .delete": function() {
  		Tasks.remove(this._id);
  	}
  });

}

