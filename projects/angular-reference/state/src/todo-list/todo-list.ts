import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TodoListApi } from './services/todo-list-api';
import { TodosStore } from './services/todos-store';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  providers: [TodoListApi, TodosStore],
  template: `
    <p>Todo List Demo</p>
    <form [formGroup]="form" class=" mb-4" (ngSubmit)="addTodo()">
      <input
        formControlName="title"
        type="text"
        placeholder="Enter todo title"
        class="input input-bordered w-full max-w-xs"
      />
      <button class="btn btn-primary" type="submit">Add Todo</button>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (todo of store.entities(); track todo.id) {
          <tr>
            <td>{{ todo.title }}</td>
            <td>{{ todo.completed ? 'Yes' : 'No' }}</td>
            <td class="flex gap-2">
              @if (!todo.completed) {
                <button
                  class="btn btn-accent"
                  (click)="store.markCompleted(todo)"
                >
                  Mark Completed
                </button>
              } @else {
                <button
                  class="btn btn-accent"
                  (click)="store.deleteTodo(todo.id)"
                >
                  Remove From List
                </button>
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: ``,
})
export class TodoListComponent {
  store = inject(TodosStore);
  form = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
    }),
  });

  addTodo() {
    if (this.form.valid) {
      const title = this.form.controls.title.value;
      this.store.addTodo({ title });
      this.form.reset();
    }
  }
}
