/*jshint esversion: 6 */
Sequelize = require('sequelize');

const options = { logging: false, operatorsAliases: false};
const sequelize = new Sequelize("sqlite:tasks.db", options);
const Op = Sequelize.Op;

const task = sequelize.define(
  'task', 
  { title: { 
    type: Sequelize.STRING,
    unique: { msg: "Task already exists"},
    allowNull: false,
  },
  done: {
    type: Sequelize.BOOLEAN,
  }
}
);

sequelize.sync()
.then(() => task.count())
.then( count => {
  if (count===0) {
    task.bulkCreate([
    {
      title: "PMUD HTML exercise",
      done: true
    },
    {
      title: "PMUD node exercise",
      done: false
    },
    {
      title: "PMUD practice",
      done: false
    }
    ])
    .then( c => console.log(`  DB created with ${c.length} elems`));
  } else {
    console.log(`  DB exists & has ${count} elems`);
  }
})
.catch( err => console.log(`   ${err}`));


/*
 * Retorna el número d'elements.
 *
 * where:  Condicions per filtrar els elements.
 */
 exports.count = (where = {}) => {
  for (let c in where) {
    if (where[c] instanceof Array) {
      let operator = where[c][0];
      let val = where[c][1];
      switch(operator) {
        case "includes":
          where[c] = {[Op.like]: '%'+val+'%'};
          break;
        case "!==":
          where[c] = {[Op.ne]: val};
          break;
        case "<":
          where[c] = {[Op.lt]: val};
          break;
        case "<=":
          where[c] = {[Op.lte]: val};
          break;
        case ">":
          where[c] = {[Op.gt]: val};
          break;
        case ">=":
          where[c] = {[Op.gte]: val};
          break;
      }
    }
  }
  return task.count({where})
  .then( count => count)
  .catch( err => {throw err;});
};


/*
 * Retorna (limit) elements que compleixen les condicions where obviant els (offset) primers.
 *
 * where:  Condicions per filtrar els elements.
 * offset: Elements del principi a obviar. 0 per començar amb el primer.
 * limit:  Quantitat d'elements a retornar. 0 per arribar fins el final.
 */
 exports.getAll = (where = {}, offset = 0, limit = 0) => {
  for (let c in where) {
    if (where[c] instanceof Array) {
      let operator = where[c][0];
      let val = where[c][1];
      switch(operator) {
        case "includes":
          where[c] = {[Op.like]: '%'+val+'%'};
          break;
        case "!==":
          where[c] = {[Op.ne]: val};
          break;
        case "<":
          where[c] = {[Op.lt]: val};
          break;
        case "<=":
          where[c] = {[Op.lte]: val};
          break;
        case ">":
          where[c] = {[Op.gt]: val};
          break;
        case ">=":
          where[c] = {[Op.gte]: val};
          break;
      }
    }
  }

  if (limit===0) {
    return task.findAll({where, offset})
    .then( tasks => tasks)
    .catch( err => {throw err;});
  } else {
    return task.findAll({where, offset, limit})
    .then( tasks => tasks)
    .catch( err => {throw err;});
  }
};


/*
 * Retorna l'element identificat per (id).
 *
 * id: Identificador de l'element.
 */
 exports.get = id => {
  return task.findOne( {where: {id}})
  .then( task => {
    if (!task) {throw new Error(`The value of id parameter is not valid.`);}
    return task;
  })
  .catch( err => {throw err;});
};


/*
 * Afegeix un nou element.
 *
 * title String amb el títol de la tasca.
 * done: Booleà indicant si està realitzada.
 */
 exports.add = (title, done=false) => {
  title = (title || "").trim();
  return task.create({title, done})
  .catch( err => {throw err;});
};


/*
 * Actualitza l'element identificat per (id).
 *
 * id: Identificador de l'element.
 * title String amb el títol de la tasca.
 * done: Booleà indicant si està realitzada.
 */
 exports.update = (id, title, done) => {
  title = (title || "").trim();
  return task.update({title, done}, {where: {id}})
  .then( n => {
    if (n[0]===0) { throw new Error(`The value of id parameter is not valid.`); }
  })
  .catch( err => {throw err;});
};


/*
 * Elimina l'element identificat per (id).
 *
 * id: Identificador de l'element.
 */
 exports.delete = id => {
  return task.destroy({where: {id}})
  .then( n => {
    if (n===0) { 
      throw new Error(`The value of id parameter is not valid.`);
    }
  })
  .catch( err => {throw err;});
};


// Resets the element list to the initial values
exports.reset = function() {
  task.destroy({where: {'title': {[Op.like]: '%'}}})
  .then( () => {
    console.log('  DB deleted');
    task.bulkCreate([
    {
      title: "PMUD HTML exercise",
      done: true
    },
    {
      title: "PMUD node exercise",
      done: false
    },
    {
      title: "PMUD practice",
      done: false
    }
    ])
    .then( c => console.log(`  DB created with ${c.length} elems`));
  });
};