"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const ensure_1 = require("./ensure");
const Task_1 = require("../entities/Task");
exports.router = (0, express_1.Router)();
const taskRepository = (0, typeorm_1.getRepository)(Task_1.Task);
/* GET home page. */
exports.router.get('/', async function (req, res, next) {
    let user;
    let userId;
    if (req.user) {
        user = req.user;
        userId = user.id;
    }
    else {
        userId = '';
    }
    const tasks = await taskRepository.find({
        relations: ['user'],
        where: [
            {
                is_secret: false,
            },
            {
                is_secret: true,
                user: {
                    id: userId,
                }
            },
        ]
    });
    res.render('index', { title: 'All Tasks', user: user, tasks: tasks });
});
exports.router.get('/tasks/my_task', ensure_1.ensure, async function (req, res, next) {
    const user = req.user;
    const tasks = await taskRepository.find({
        relations: ['user'],
        where: [
            {
                user: {
                    id: user.id,
                }
            },
        ]
    });
    res.render('index', { title: 'My Tasks', user: user, tasks: tasks });
});
exports.router.get('/tasks/add', ensure_1.ensure, async function (req, res, next) {
    res.render('./tasks/add', { title: 'add' });
});
//タスク追加
exports.router.post('/tasks/add', ensure_1.ensure, async function (req, res, next) {
    const user = req.user;
    const task = new Task_1.Task();
    task.title = req.body.title;
    task.comment = req.body.comment || '';
    task.process_status = 0;
    task.is_secret = req.body.is_secret ? true : false;
    task.user = user;
    const inserted = await taskRepository.save(task);
    res.redirect('/');
});
//タスク参照
exports.router.get('/tasks/view/:id', async function (req, res, next) {
    const task = await taskRepository.findOne({
        relations: ['user'],
        where: {
            id: req.params.id
        }
    });
    if (!task)
        res.redirect('/');
    let user;
    if (req.user) {
        user = req.user;
    }
    // 編集権限を確認
    const readOnly = (!user.is_admin && (task === null || task === void 0 ? void 0 : task.user.id) != user.id) ? true : false;
    res.render('./tasks/edit', { title: 'Task', user: user, task: task, readOnly: readOnly });
});
//タスク更新
exports.router.post('/tasks/edit/:id', ensure_1.ensure, async function (req, res, next) {
    const user = req.user;
    const options = {
        relations: ['user'],
        where: {
            id: req.params.id
        }
    };
    const task = await taskRepository.findOne(options) || new Task_1.Task();
    console.log(req.body);
    if (!user || !task.id)
        res.redirect('/');
    if (!user.is_admin && task.user.id != user.id)
        res.redirect('/');
    task.title = req.body.title;
    task.comment = req.body.comment || '';
    task.process_status = req.body.process_status || 0;
    task.is_secret = req.body.is_secret ? true : false;
    const updated = await taskRepository.save(task);
    res.redirect('/');
});
//タスク削除
exports.router.post('/tasks/delete/:id', ensure_1.ensure, async function (req, res, next) {
    const user = req.user;
    const options = {
        relations: ['user'],
        where: {
            id: req.params.id
        }
    };
    const task = await taskRepository.findOne(options) || new Task_1.Task();
    console.log(req.body);
    if (!user || !task.id)
        res.redirect('/');
    if (!user.is_admin && task.user.id != user.id)
        res.redirect('/');
    const deleted = await taskRepository.remove([task]);
    res.redirect('/');
});
//タスク公開設定変更
exports.router.post('/tasks/toggle_public/:id', ensure_1.ensure, async function (req, res, next) {
    const user = req.user;
    const options = {
        relations: ['user'],
        where: {
            id: req.params.id
        }
    };
    const task = await taskRepository.findOne(options) || new Task_1.Task();
    if (!user || !task.id)
        res.redirect('/');
    if (!user.is_admin && task.user.id != user.id)
        res.redirect('/');
    task.is_secret = task.is_secret ? false : true;
    const updated = await taskRepository.save(task);
    res.redirect('/');
});
