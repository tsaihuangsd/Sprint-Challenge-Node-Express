// import modules
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// instanciate your server
const port = 9000;
const server = express();
server.use(express.json());

const projectModel = require('./data/helpers/projectModel.js');
const actionModel = require('./data/helpers/actionModel.js');

// MIDDLEWARES
server.use(logger('tiny'), cors(), helmet());

//CRUB methods
server.get('/projects', (req, res) => {
    projectModel.get()
                .then(projects =>{
                    res.status(200)
                        .json(projects);
                })
                .catch(err=>res.send(err));
});

server.get('/actions', (req, res) => {
    actionModel.get()
                .then(actions =>{
                    res.status(200)
                        .json(actions);
                })
                .catch(err=>res.send(err));
});

server.get('/projects/:id', (req, res) => {
    req.id = req.params.id;
    projectModel.get(req.id)
                .then(query =>{
                    res.status(200)
                        .json(query);
                })
                .catch(err=>res.send(`Project id: ${req.id} cannot be found`));
});

server.get('/actions/:id', (req, res) => {
    req.id = req.params.id;
    actionModel .get(req.id)
                .then(query =>{
                    res.status(200)
                        .json(query);
                })
                .catch(err=>res.send(`Action id: ${req.id} cannot be found`));
});

server.get('/projects/:projectId/actions', (req, res) => {
    req.projectId = req.params.projectId;
    projectModel.getProjectActions(req.projectId)
                .then(actions =>{
                    if (actions.length === 0){
                        return res  .status(200)
                                    .send(`Project id: ${id} cannot be found.`) 
                    }
                    res .status(200)
                        .json(actions);
                })
                .catch(err=>res.send(
                    `error occurred during data retreival.`));
});

server.post('/projects', (req, res) =>{
    projectModel.insert(req.body)
                .then(idObject =>{
                    res.status(201)
                        .json(idObject);
                })
                .catch(err=>res.send(err));
});

server.post('/actions', (req, res) =>{
    actionModel .insert(req.body)
                .then(idObject =>{
                    res .status(200)
                        .json(idObject);
                })
                .catch(err=>res.send(err));
});

server.delete('/projects/:id', (req, res)=>{
    const id = req.params.id;
    projectModel.remove(id)
                .then(responseId=>{
                    if (responseId===0){
                        return res  .status(500)
                                    .send(`Project id: ${id} cannot be found.`)
                    }
                    res .status(200)
                        .send(`Project with id: ${id} has been deleted`);
                })
                .catch(err=>res.send(err));
});

server.delete('/actions/:id', (req, res)=>{
    const id = req.params.id;
    actionModel.remove(id)
                .then(responseId=>{
                    if (responseId === 0){
                        return res  .status(500)
                                    .send(`Action id: ${id} cannot be found.`)
                    }
                    res .status(200)
                        .send(`Action with id: ${id} has been deleted`);
                })
                .catch(err=>res.send(err));
});

server.put('/projects/:id', (req, res)=>{
    const id = req.params.id;
    projectModel.update(id, req.body)
                .then(returnedId =>{
                    if (!returnedId) {
                        res.status(422)
                        .send(`Project id: ${id} cannot be found.`)
                    }
                    res .status(200)
                        .send(`Project id: ${id} has been updated`);
                })
                .catch(err=>res.send(err));
});

server.put('/actions/:id', (req, res)=>{
    const id = req.params.id;
    actionModel .update(id, req.body)
                .then(returnedId =>{
                    if (!returnedId) {
                        res .status(422)
                            .send(`Action id: ${id} cannot be found.`)
                    }
                    res .status(200)
                        .send(`Action id: ${id} has been updated`);
                })
                .catch(err=>res.send(err));
})


// call server.listen w/ a port of your choosing
server.listen(port, () => {
    console.log(`API running on port ${port}`);
  });