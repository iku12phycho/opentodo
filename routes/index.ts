import { Router, Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { ensure } from './ensure';
import { Task } from "../entities/Task";

export const router = Router();

const taskRepository = getRepository(Task);

/* GET home page. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  let user: any;
  let userId: string;
  if (req.user){
    user = req.user;
    userId = user.id;
  }else{
    userId = '';
  }
  const tasks = await taskRepository.find(
    {
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
    ]}
  );
  
  res.render('index', { title: 'All Tasks', user: user, tasks: tasks });
});

router.get('/tasks/my_task', ensure, async function(req: Request, res: Response, next: NextFunction){
  const user: any = req.user;
  const tasks = await taskRepository.find(
    {
      relations: ['user'],
      where: [
      {
        user: {
          id: user.id,
        }
      },
    ]
  }
  );
  res.render('index', {title: 'My Tasks', user: user, tasks: tasks });
});

router.get('/tasks/add', ensure, async function(req: Request, res: Response, next: NextFunction){
  res.render('./tasks/add', {title: 'add'});
});

//タスク追加
router.post('/tasks/add', ensure, async function(req: Request, res: Response, next: NextFunction){
  const user: any = req.user;
  console.log(user);
  const task = new Task();
  task.title = req.body.title;
  task.comment = req.body.comment || '';
  task.process_status = 0;
  task.is_secret = req.body.is_secret ? true: false;
  task.userId = user.id;
  const inserted = await taskRepository.save(task);
  res.redirect('/');
});

//タスク参照
router.get('/tasks/view/:id', async function(req: Request, res: Response, next: NextFunction){
  const task = await taskRepository.findOne({
    relations: ['user'],
    where: {
      id: req.params.id
    }
  });
  if (!task) res.redirect('/');
  let user: any;
  if (req.user){
    user = req.user;
  }
  // 編集権限を確認
  const readOnly = (!user.is_admin  && task?.user.id != user.id) ? true: false;
  res.render('./tasks/edit', {title: 'Task', user: user, task: task, readOnly: readOnly});
});

//タスク更新
router.post('/tasks/edit/:id', ensure, async function(req: Request, res: Response, next: NextFunction){
  const user : any = req.user;
  const options = {
    relations: ['user'],
    where: {
      id: req.params.id
    }
  };
  const task = await taskRepository.findOne(options) || new Task();
  console.log(req.body);

  if (!user || !task.id) res.redirect('/');
  if (!user.is_admin && task.user.id != user.id) res.redirect('/');
  task.title = req.body.title;
  task.comment = req.body.comment || '';
  task.process_status = req.body.process_status || 0;
  task.is_secret = req.body.is_secret ? true: false;
  const updated = await taskRepository.save(task);
  res.redirect('/');
});

//タスク削除
router.post('/tasks/delete/:id', ensure, async function(req: Request, res: Response, next: NextFunction){
  const user : any = req.user;
  const options = {
    relations: ['user'],
    where: {
      id: req.params.id
    }
  };
  const task = await taskRepository.findOne(options) || new Task();
  console.log(req.body);

  if (!user || !task.id) res.redirect('/');
  if (!user.is_admin && task.user.id != user.id) res.redirect('/');
  const deleted = await taskRepository.remove([task]);
  res.redirect('/');
});

//タスク公開設定変更
router.post('/tasks/toggle_public/:id', ensure, async function(req: Request, res: Response, next: NextFunction){
  const user : any = req.user;
  const options = {
    relations: ['user'],
    where: {
      id: req.params.id
    }
  };
  const task = await taskRepository.findOne(options) || new Task();

  if (!user || !task.id) res.redirect('/');
  if (!user.is_admin && task.user.id != user.id) res.redirect('/');
  task.is_secret = task.is_secret ? false : true;
  const updated = await taskRepository.save(task);
  res.redirect('/');
});
