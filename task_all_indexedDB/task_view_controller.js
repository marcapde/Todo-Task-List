/*jshint esversion: 6 */
$(function() {

function TaskVC(name = "Task", id = "#tasks") {
  this.name = name;
  this.id = id;
  this.active = Cookie.get(`active${this.id.substring(1)}`) ? JSON.parse(Cookie.get(`active${this.id.substring(1)}`)) : false;
  this.search = Cookie.get(`search${this.id.substring(1)}`) ? JSON.parse(Cookie.get(`search${this.id.substring(1)}`)) : "";
  this.order  = Cookie.get(`order${this.id.substring(1)}`)  ? JSON.parse(Cookie.get(`order${this.id.substring(1)}`))  : {};
  this.itemsOnPage = Cookie.get(`itemsOnPage${this.id.substring(1)}`) ? JSON.parse(Cookie.get(`itemsOnPage${this.id.substring(1)}`)) : 10;
  this.currentPage = 1;
  this.display = Cookie.get(`display${this.id.substring(1)}`) ? JSON.parse(Cookie.get(`display${this.id.substring(1)}`)) : "show";
  this.displayMini = false;
  // VIEWs
  TaskVC.prototype.changeDisplay = function() {
    this.displayMini = !this.displayMini;
    if (this.displayMini == true){ 
      this.display = ""; // Cookie.get(cookieDisplayMini[`${this.id}`]) ? JSON.parse(Cookie.get(cookieDisplayMini[`${this.id}`])) : "";
    }else{
      this.display = Cookie.get(`display${this.id.substring(1)}`) ? JSON.parse(Cookie.get(`display${this.id.substring(1)}`)) : "show";
    }    
    this.listController();
    return ;
    

  }
  TaskVC.prototype.saveDisplay = function() {
    //console.log("changing display")
    this.display == "" ? this.display = "show" : this.display = ""; 
    if(this.displayMini){   
      Cookie.set(`display${this.id.substring(1)}`, JSON.stringify(this.display), 7);
    }
  }

  TaskVC.prototype.taskList = function(tasks) {
    return `
    <div class="card">
      <div width="100%" class="card-header">
        <button width="100%" id="collapse_btn"
         class="btn btn-secondary btn-block w-100" 
         type="button" data-bs-toggle="collapse" 
         data-bs-target="#col-${this.id.substring(1)}" >${this.name} list
        </button>        
      </div>
      <div class="collapse ${this.display}" id="col-${this.id.substring(1)}">
        <div class="card-body" >
          <span class="nobr" style="float:left;">Items/page <select name="itemsOnPage" class="iopage"><option value="5">5</option><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select>
          Pagination: </span><div class="pagination"></div>
          <div class="btn-group">
            <button class="new btn btn-success">New task</button>
            <button class="reset btn btn-danger">Reset tasks</button>
            <button class="list_a btn btn-secondary"></button>
          </div>
          <p/>
          Task Title
          <button class="uporder btn btn-secondary" title="Up order">&blacktriangle;</button>
          <button class="doorder btn btn-secondary" title="Down order">&blacktriangledown;</button>
          <button class="noorder btn btn-secondary" title="No order">&blacklozenge;</button>
          <span class="nobr"><input type="text" class="search form-control-sm " value="${this.search}" placeholder="Search" onfocus="let v=this.value; this.value=''; this.value=v"> <img class="dsearch" title="Clean Search" src="public/icon_delete.png"/></span>
        
      
      ` +
    tasks.reduce(
      (ac, task) => ac += 
      `<div class="tlist page-item">
      <button type="submit " class="delete" taskid="${task.id}" title="Delete"> <img src="public/icon_delete.png"/> </button>
      <button type="button " class="edit"   taskid="${task.id}" title="Edit"  > <img src="public/icon_edit.png"/> </button>
      <button type="button" class="switch" taskid="${task.id}" title=${task.done ? 'Start' : 'Stop'}> <img src="${task.done ? 'public/icon_play.png' : 'public/icon_stop.png'}"/> </button>
      ${task.title}
      </div>\n
      ` ,    
      "") 
      +
      `</div></div></div>` ;
      
  };

  TaskVC.prototype.taskForm = function(msg, id, action, title, done) {
    return `<h1>${this.name} form</h1>
    ${msg}: <p class="form">
    <input type="text"     name="title"  value="${title}" placeholder="title"/>
    Done: 
    <input type="checkbox" name="done"   ${done ? 'checked' : ''}/>
    <button type="submit" class="${action}" taskid="${id}">${action}</button>
    </p>
    <button class="list">Go back</button>
    `;
  };


  // CONTROLLERs

  TaskVC.prototype.listController = function() {
    Cookie.set(`active${this.id.substring(1)}`, JSON.stringify(this.active), 7);
    Cookie.set(`search${this.id.substring(1).substring}`, JSON.stringify(this.search), 7);
    Cookie.set(`order${this.id.substring(1)}`,  JSON.stringify(this.order),  7);
    Cookie.set(`itemsOnPage${this.id.substring(1)}`, JSON.stringify(this.itemsOnPage), 7);
    if(!this.displayMini){
    Cookie.set(`display${this.id.substring(1)}`,  JSON.stringify(this.display),  7);
    }
    let where = {};
    if (this.active)
      where.done = false;
    if (this.search)
      where.title = ["includes", this.search];

    let that = this;
    let p1 = this.task_model.getAll(where, this.order, (this.currentPage-1)*this.itemsOnPage, this.itemsOnPage);
    let p2 = this.task_model.count(where);
    Promise.all([p1, p2])
    .then(([tasks, count]) => {
      $(this.id).html(this.taskList(tasks));
      $(this.id+' .list_a').html(this.active ? 'All tasks' : 'Active tasks');
      $(this.id+' .iopage').val(this.itemsOnPage);
      $(this.id+' .pagination').pagination({
          items: count,
          itemsOnPage: this.itemsOnPage,
          currentPage: this.currentPage,
          cssStyle: 'compact-theme',
          onPageClick: (pn, e) => {this.currentPage = pn; this.listController(); $(this.id+' .pagination').pagination('drawPage', pn);}  
      });
      if (this.order.title === undefined) {
        $(this.id+' .noorder').show(); $(this.id+' .uporder').hide(); $(this.id+' .doorder').hide();
      } else if (this.order.title) {
        $(this.id+' .noorder').hide(); $(this.id+' .uporder').hide(); $(this.id+' .doorder').show();
      } else { 
        $(this.id+' .noorder').hide(); $(this.id+' .uporder').show(); $(this.id+' .doorder').hide();
      }
      if (this.search) $(this.id+' .search').focus();
    })
    .catch(error => {throw error;});
  };

  TaskVC.prototype.newController = function() {
    $(this.id).html(this.taskForm('New task', null, 'create', '', ''));
    $(this.id+' input[name=title]').focus();
  };

  TaskVC.prototype.editController = function(id) {
    this.task_model.get(id)
    .then(task => {
      $(this.id).html(this.taskForm('Edit task', id, 'update', task.title, task.done));
      $(this.id+' input[name=title]').focus();
    })
    .catch(error => {throw error;});
  };

  TaskVC.prototype.createController = function() {
    this.task_model.create($(this.id+' input[name=title]').val(), $(this.id+' input[name=done]').is(':checked')) 
    .then(() => {this.listController();})
    .catch(error => {throw error;});
  };

  TaskVC.prototype.updateController = function(id) {
    this.task_model.update(id, $(this.id+' input[name=title]').val(), $(this.id+' input[name=done]').is(':checked'))
    .then(() => {this.listController();})
    .catch(error => {throw error;});
  };

  TaskVC.prototype.switchController = function(id) {
    let data = this.task_model.get(id)
    .then((data) => {
      this.task_model.update(id,data.title,!data.done);
      this.listController();

    })
    .catch(error => {throw error;});
  };

  TaskVC.prototype.deleteController = function(id) {
    this.task_model.delete(id)
    .then(() => {
      this.listController();
    })
    .catch(error => {throw error;});
  };

  TaskVC.prototype.resetController = function() {
    this.task_model.reset()
      .then(() => {
      this.listController();
    })
    .catch(error => {throw error;});
  };


  // ROUTER

  TaskVC.prototype.eventsController = function() {
    $(document).on('click', this.id+' .list',   () => this.listController());
    $(document).on('click', this.id+' .list_a', () => {this.active = !this.active; this.listController();});
    $(document).on('click', this.id+' .new',    () => this.newController());
    $(document).on('click', this.id+' .edit',   (e)=> this.editController(Number($(e.currentTarget).attr('taskid'))));
    $(document).on('click', this.id+' .create', () => this.createController());
    $(document).on('click', this.id+' .update', (e)=> this.updateController(Number($(e.currentTarget).attr('taskid'))));
    $(document).on('click', this.id+' .switch', (e)=> this.switchController(Number($(e.currentTarget).attr('taskid'))));
    $(document).on('click', this.id+' .delete', (e)=> this.deleteController(Number($(e.currentTarget).attr('taskid'))));
    $(document).on('click', this.id+' .reset',  (e)=> this.resetController());
    $(document).on('input', this.id+' .iopage', () => {this.itemsOnPage = Number($(this.id+' .iopage').val()); this.currentPage = 1; this.listController();});
    $(document).on('input', this.id+' .search', () => {this.search = $(this.id+' .search').val(); this.listController();});
    $(document).on('click', this.id+' #collapse_btn', () => {this.saveDisplay(); this.listController();});

    $(document).on('click', this.id+' .dsearch',() => {this.search = ''; this.listController();});
    $(document).on('click', this.id+' .uporder',() => {this.order = {};             this.listController();});
    $(document).on('click', this.id+' .doorder',() => {this.order = {title: false}; this.listController();});
    $(document).on('click', this.id+' .noorder',() => {this.order = {title: true};  this.listController();});
    $(document).on('keypress', this.id+' .form',(e) => {if (e.keyCode === 13) $(this.id+ " button[type=submit]").trigger("click");});
  };

  // Creation of an object to manage the task model
  this.task_model = new TaskModel(this.id);
  setTimeout(() => {
    this.listController();
    this.eventsController();
  }, 500);
}

// Creation of an object View-Controller for the tasks
let task_vc = new TaskVC();
let task_vch = new TaskVC('Home task', '#home_tasks');
let task_vcu = new TaskVC('Univerity task', '#uni_tasks');

let cookieDisplay = {
  '#task_vc'  : 'show',
  '#task_vch' : 'show',
  '#task_vcu' : 'show',
}
let cookieDisplayMini =  {
  '#task_vc'  : '',
  '#task_vch' : '',
  '#task_vcu' : '',
}

$(window).resize(function() {
  // Aquí va el codi que vols que s'executi cada vegada que canviem la mida de la finestra del nostre navegador
  let amplada = $(window).width() // Funció que retorna l'amplada actual de la finestra del nostre navegador
  if (amplada < 768){
    if (task_vc.displayMini == false){
      console.log("Changing display")
      task_vc.changeDisplay();
      task_vch.changeDisplay();
      task_vcu.changeDisplay();
    }              
  }else{
    if (task_vc.displayMini == true){
      task_vc.changeDisplay();
      task_vch.changeDisplay();
      task_vcu.changeDisplay();
    }   
  }
});


});
