import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { DateService } from '../shared/date.service';
import { Task, TasksService } from '../shared/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  public form: FormGroup;
  public tasks: Task[] = [];

  constructor(public dateService: DateService, public taskService: TasksService) { }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value => this.taskService.load(value)) //switchMap - со стрима dateService переключаемся на стрим taskService
    ).subscribe(tasks => {
      this.tasks = tasks;
    });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit(): void{
    const title = this.form.value.title;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };

    this.taskService.create(task).subscribe(
      newTask => {
        this.tasks.push(newTask);
        this.form.reset();
      },
      err => console.log(err));
  }

  removeTask(task: Task){
    this.taskService.removeTask(task).subscribe(() => {this.tasks.splice(this.tasks.indexOf(task)); },
      err => console.log(err));
  }
}
