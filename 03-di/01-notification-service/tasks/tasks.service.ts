import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from "./task.model";
import { NotificationsService } from "notifications/notifications.service";
import { User } from "users/user.model";
import { UsersService } from "users/users.service";

@Injectable()
export class TasksService {
  @Inject(NotificationsService)
  private notificationsService: NotificationsService;
  @Inject(UsersService)
  private usersService: UsersService;

  private tasks: Task[] = [];

  constructor() {}

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, assignedTo } = createTaskDto;
    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo,
    };
    this.tasks.push(task);
    const user: User = this.usersService.getUserById(assignedTo);
    this.notificationsService.sendEmail(
      user.email,
      "Новая задача",
      `"Вы назначены ответственным за задачу: "${task.title}"`,
    );

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }

    Object.assign(task, updateTaskDto);
    const user: User = this.usersService.getUserById(task.assignedTo);
    this.notificationsService.sendSMS(
      user.phone,
      `${task.title}" изменен на "${task.status}`,
    );
    return task;
  }
}
