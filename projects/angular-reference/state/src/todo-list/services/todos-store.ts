import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
} from '@ngrx/signals';
import {
  removeEntity,
  setEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, mergeMap, pipe } from 'rxjs';
import { ApiTodoListItem, TodoListApi } from './todo-list-api';

export const TodosStore = signalStore(
  withEntities<ApiTodoListItem>(),
  withProps(() => {
    const api = inject(TodoListApi);
    return {
      api,
    };
  }),
  withMethods((store) => {
    return {
      _load: rxMethod<void>(
        pipe(
          mergeMap(() =>
            store.api.getTodoList().pipe(
              tapResponse(
                (todos) => patchState(store, setEntities(todos)),
                (error) => console.error('Failed to load todos', error),
              ),
            ),
          ),
        ),
      ),
      addTodo: rxMethod<Omit<ApiTodoListItem, 'id' | 'completed'>>(
        pipe(
          mergeMap((item) =>
            store.api.addTodoItem(item).pipe(
              tapResponse(
                (newTodo) => patchState(store, setEntity(newTodo)),
                (error) => console.error('Failed to add todo', error),
              ),
            ),
          ),
        ),
      ),
      markCompleted: rxMethod<ApiTodoListItem>(
        pipe(
          map((item) => ({
            ...item,
            completed: true,
          })),
          mergeMap((item) =>
            store.api.updateTodoItem(item).pipe(
              tapResponse(
                (updatedTodo) => patchState(store, setEntity(updatedTodo)),
                (error) =>
                  console.error('Failed to mark todo as completed', error),
              ),
            ),
          ),
        ),
      ),
      deleteTodo: rxMethod<string>(
        pipe(
          mergeMap((id) =>
            store.api.deleteTodoItem(id).pipe(
              tapResponse(
                () => patchState(store, removeEntity(id)),
                (error) => console.error('Failed to delete todo', error),
              ),
            ),
          ),
        ),
      ),
    };
  }),
  withHooks({
    onInit: (store) => {
      store._load();
    },
  }),
);
