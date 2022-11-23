/*jshint esversion: 6 */
const fs = require("fs");

// Nom del fitxer de text on es guarden els elements en format JSON.
const DB_FILENAME = "tasks.json";


// Model de dades.
//
// Aquesta variable guarda tots els elements com un array d'objectes,
// on els atributs de cada objecte són els seus camps.
//
// Al principi aquesta variable conté tres elements, però desprès es crida a load()
// per carregar els elements guardats en el fitxer DB_FILENAME si existeix.
let tasks = [
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
];


/**
 *  Carrega els elements en format JSON del fitxer DB_FILENAME.
 *
 *  El primer cop que s'executa aquest mètode, el fitxer DB_FILENAME no
 *  existeix, i es produirà l'error ENOENT. En aquest cas es guardarà el
 *  contingut inicial.
 */
 const load = () => {
  fs.readFile(DB_FILENAME, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        save();
        return;
      }
      throw err;
    }

    let json = JSON.parse(data);
    if (json) {
      tasks = json;
    }
  });
};


/**
 *  Guarda els elements en format JSON en el fitxer DB_FILENAME.
 */
 const save = () => {
  fs.writeFile(DB_FILENAME, JSON.stringify(tasks),
    err => {
      if (err) throw err;
    });
};


/*
 * Retorna el número d'elements.
 */
 exports.count = () => {
  return new Promise((resolve, reject) => resolve(tasks.length));
};


/*
 * Retorna (limit) elements que compleixen les condicions where obviant els (offset) primers.
 *
 * where:  Condicions per filtrar els elements.
 * offset: Elements del principi a obviar. 0 per començar amb el primer.
 * limit:  Quantitat d'elements a retornar. 0 per arribar fins el final.
 */
 exports.getAll = (where = {}, offset = 0, limit = 0) => {
  return new Promise((resolve, reject) => {
    tasks.map((e, i) => e.id = i);
    let t = tasks.filter(e => {
      for (let c in where){
        if (e[c] !== where[c]) return false;
      }
      return true;
    });
    if (limit===0) {
      resolve(t.slice(offset));
    } else {
      resolve(t.slice(offset, offset+limit));
    }
  });
};


/*
 * Retorna l'element identificat per (id).
 *
 * id: Identificador de l'element.
 */
 exports.get = id => {
  return new Promise((resolve, reject) => {
    const task = tasks[id];
    if (typeof task === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      resolve(JSON.parse(JSON.stringify(task)));
    }
  });
};


/*
 * Afegeix un nou element.
 *
 * title String amb el títol de la tasca.
 * done: Booleà indicant si està realitzada.
 */
 exports.add = (title, done=false) => {
  return new Promise((resolve, reject) => {
    tasks.push({
      title: (title || "").trim(),
      done
    });
    save();
    resolve();
  });
};


/*
 * Actualitza l'element identificat per (id).
 *
 * id: Identificador de l'element.
 * title String amb el títol de la tasca.
 * done: Booleà indicant si està realitzada.
 */
 exports.update = (id, title, done) => {
  return new Promise((resolve, reject) => {
    const task = tasks[id];
    if (typeof task === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      tasks.splice(id, 1, {
        title: (title || "").trim(),
        done
      });
      save();
      resolve();
    }
  });
};


/*
 * Elimina l'element identificat per (id).
 *
 * id: Identificador de l'element.
 */
 exports.delete = id => {
  return new Promise((resolve, reject) => {
    const task = tasks[id];
    if (typeof task === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      tasks.splice(id, 1);
      save();
      resolve();
    }
  });
};


// Carrega els elements guardats en el fitxer si existeix.
load();
