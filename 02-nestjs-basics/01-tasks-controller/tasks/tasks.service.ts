import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId: number = 1;

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task =  this.tasks.find((task) => task.id === id);
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    return task;
  }

  createTask(task: Task): Task {
    task.id = task.id || String(this.nextId++);
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, update: Task): Task {
    const task = this.getTaskById(id);
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
 
    task.title = update.title;
    task.description = update.description;
    task.status = update.status;
    
    return task;
  }

  deleteTask(id: string): Task {
    const task = this.getTaskById(id);
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);

    this.tasks = this.tasks.filter((task) => task.id !== id);
    return task;
  }
}
