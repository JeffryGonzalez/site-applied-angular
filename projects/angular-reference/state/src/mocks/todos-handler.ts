import { delay, http, HttpResponse } from 'msw';
import { ApiTodoListItem } from '../todo-list/services/todo-list-api';

let TODOS: ApiTodoListItem[] = [
  { id: '1', title: 'Clean Garage', completed: false },
  { id: '2', title: 'Feed Birds', completed: true },
  { id: '3', title: 'Mow Lawn', completed: false },
  { id: '4', title: 'Do Dishes', completed: true },
  { id: '5', title: 'Sweep Drive', completed: false },
];

export const TodoListHandlers = [
  http.get('https://some-api/todo-list', async () => {
    await delay();
    return HttpResponse.json(TODOS);
  }),
  http.delete('https://some-api/todo-list/:id', async (req) => {
    const { id } = req.params as unknown as { id: string };

    TODOS = TODOS.filter((todo) => todo.id !== id);

    await delay();
    return new HttpResponse('', { status: 204 });
  }),
  http.post('https://some-api/todo-list', async ({ request }) => {
    const item = (await request.json()) as Omit<ApiTodoListItem, 'id'>;
    const newItem: ApiTodoListItem = {
      ...item,
      id: (TODOS.length + 1).toString(),
    };
    TODOS.push(newItem);
    await delay();
    return HttpResponse.json(newItem, { status: 201 });
  }),
  http.put('https://some-api/todo-list/:id', async ({ request }) => {
    const item = (await request.json()) as ApiTodoListItem;
    TODOS = TODOS.map((todo) => (todo.id === item.id ? item : todo));
    await delay();
    return HttpResponse.json(item);
  }),
];
