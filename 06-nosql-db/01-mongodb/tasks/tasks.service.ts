import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task } from "./schemas/task.schema";
import { Model, ObjectId } from "mongoose";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private TaskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.TaskModel(createTaskDto);
    await task.save();
    return task;
  }

  async findAll(): Promise<Task[]> {
    return this.TaskModel.find().exec();
  }

  async findOne(id: ObjectId): Promise<Task> {
    const task = await this.TaskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task not found`);
    }
    return task;
  }

  async update(id: ObjectId, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.TaskModel.findByIdAndUpdate(
      id,
      updateTaskDto,
      {
        new: true,
        runValidators: true,
      },
    ).exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task not found`);
    }
    return updatedTask;
  }

  async remove(id: ObjectId): Promise<Task> {
    const deletedTask = await this.TaskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) {
      throw new NotFoundException(`Task not found`);
    }
    return deletedTask;
  }
}
