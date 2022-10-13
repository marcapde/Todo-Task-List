/*jshint esversion: 6 */
$(function() {

  let actives= Cookie.get("actives") ? JSON.parse(Cookie.get("actives")) : false;;
  let filterText = Cookie.get("filterText") ? JSON.parse(Cookie.get("filterText")) : "";
  let orderTr="&blacklozenge;"
  let orderCls="noorder";
  let order= Cookie.get("order") ? JSON.parse(Cookie.get("order")) : {};

// VIEWs

const taskList = function(tasks) { 
  //el onfocus es per mantenir el cursor al final del text
  return `<h1>Task list</h1>
  <button class="new">New task</button>
  <button class="reset">Reset tasks</button>
  <button class="active">${!actives? "All Tasks" : "Active"}</button>
  <button id="orderBtn" class="${orderCls}">${orderTr}</button>
  <input type="text" class="filter" placeholder="Name Tasks" value="${filterText}" 
  onfocus="let v=this.value; this.value=''; this.value=v;">
  ` +
  tasks.reduce(
    (ac, task) => ac += 
    `<div>
    <button type="submit" class="delete" taskid="${task.id}" title="Delete"> <img src="public/icon_delete.png"/> </button>
    <button type="button" class="edit"   taskid="${task.id}" title="Edit"  > <img src="public/icon_edit.png"/> </button>
    <button type="button" class="switch" taskid="${task.id}" title=${task.done ? 'Start' : 'Stop'}> <img src="${task.done ? 'public/icon_play.png' : 'public/icon_stop.png'}"/> </button>
    ${task.title}
    </div>\n`, 
    "");
};

const taskForm = function(msg, id, action, title, done) {
  return `<h1>Task form</h1>
  ${msg}: <p>
  <input type="text"     name="title"  value="${title}" placeholder="title"/>
  Done: 
  <input type="checkbox" name="done"   ${done ? 'checked' : ''}/>
  <button class="${action}" taskid="${id}">${action}</button>
  </p>
  <button class="list">Go back</button>
  `;
};


// CONTROLLERs

buscador = function(){
  display={};
  if(filterText != ""){
    $('#tasks').html(taskList(task_model.getAll(
    {title: ['includes', filterText]}
    )));
  }
}
const listController = function() {
  Cookie.set("actives", JSON.stringify(actives), 7);
  Cookie.set("filterText", JSON.stringify(filterText), 7);
  Cookie.set("order", JSON.stringify(order), 7);
  display={};
  if(actives){
    $('#tasks').html(taskList(task_model.getAll({'done':false, title: ['includes', filterText]},order )));
  }else{
    $('#tasks').html(taskList(task_model.getAll({title: ['includes', filterText]},order)));
  }  
};

const newController = function() {
  $('#tasks').html(taskForm('New task', null, 'create', '', ''));
};

const editController = function(id) {
  let task = task_model.get(id);
  $('#tasks').html(taskForm('Edit task', id, 'update', task.title, task.done));
};

const createController = function() {
  task_model.create($('input[name=title]').val(), $('input[name=done]').is(':checked'));  
  listController();
};

const updateController = function(id) {
  task_model.update(id, $('input[name=title]').val(), $('input[name=done]').is(':checked'));
  listController();
};

const switchController = function(id) {
  let task = task_model.get(id);
  task_model.update(id, task.title, !task.done); 
  listController(); 
};

const deleteController = function(id) {
  task_model.deletes(id);
  listController(); 
};

const resetController = function() {
  task_model.reset();
  listController();
};


// ROUTER

const eventsController = function() {
  $(document).on('click','.list',   () => listController());
  $(document).on('click','.new',    () => newController());
  $(document).on('click','.active', () => {actives=!actives; listController()});
  $(document).on('click','.edit',   (e)=> editController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.create', () => createController());
  $(document).on('click','.update', (e)=> updateController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.switch', (e)=> switchController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.delete', (e)=> deleteController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.reset',  (e)=> resetController());
  $(document).on('keyup','.filter', (e)=> {filterText=$(".filter").val(); buscador(); $(".filter").focus()});
  $(document).on('click','.uporder', ()=> {order={title:true}; orderTr="&blacktriangledown;" ;orderCls="doorder";listController();});
  $(document).on('click','.doorder', ()=> {order={title:false};orderTr="&blacklozenge;"      ;orderCls="noorder";listController();});
  $(document).on('click','.noorder', ()=> {order={};           orderTr="&blacktriangle;"     ;orderCls="uporder";listController();});
};

let task_model = new TaskModel();
listController();
eventsController();
});
