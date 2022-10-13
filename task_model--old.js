/*jshint esversion: 6 */
function TaskModel (){
  TaskModel.prototype.initial_tasks = [
    {
      title: "PMUD HTML exercise",
      done: true
    },
    {
      title: "PMUD CSS exercise",
      done: false
    },
    {
      title: "PMUD JavaScript exercise",
      done: false
    }
  ];
  
  this.tasks = JSON.parse(JSON.stringify(this.initial_tasks))//Object.assign([], initial_tasks);//initial_tasks.slice();//Object.assign({}, initial_tasks); //([].concat(initial_tasks)); [...initial_tasks]
  
  // Returns the number of elements
  TaskModel.prototype.count = function() {
    return this.tasks.length;
  };
  
  // Returns all elements
  TaskModel.prototype.getAll = function() {
    this.tasks.map((e, i) => e.id = i);
    return this.tasks;
  };
  
  /* Returns the element identified by (id).
     id: Element identification. */
  TaskModel.prototype.get = function(id) {
    const task = this.tasks[id];
    if (typeof task === "undefined") {
      throw new Error(`The value of id parameter is not valid.`);
    } else {
      return JSON.parse(JSON.stringify(task)); //{...task}
    }
  };
  
  /* Adds a new element
     title: String with the task title.
     done: Boolean explaining if the task is done or not. */
  TaskModel.prototype.create = function(title, done=false) {
    this.tasks.push({
      title: (title || "").trim(),
      done // done = done: done
    });
  };
  
  /* Updates the element identified by (id).
     id: Element identification.
     title: String with the task title.
     done: Boolean explaining if the task is done or not. */
  TaskModel.prototype.update = function(id, title, done) {
    if (typeof this.tasks[id] === "undefined") {
      throw new Error(`The value of id parameter is not valid.`);
    } else {
      this.tasks.splice(id, 1, {
        title: (title || "").trim(),
        done
      });
    }
  };
  
  /* Deletes the element identified by (id).
     id: Element identification. */
  TaskModel.prototype.deletes = function(id) {
    this.tasks.splice(id, 1);  
  };
  
  // Resets the element list to the initial values
  TaskModel.prototype.reset = function() {
    this.tasks = JSON.parse(JSON.stringify(this.initial_tasks)); // Object.assign([], initial_tasks);//initial_tasks.slice();//Object.assign({}, initial_tasks); //([].concat(initial_tasks)); 
  };
  
}
