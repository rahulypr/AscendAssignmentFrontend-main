import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { Button, TextField } from '@material-ui/core';

const DataForm = () => {
  const [data, setData] = useState([
   
  ]);

  const [newTaskName, setNewTaskName] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');

  const handleAddList = () => {
    const newList = {
      id: uuidv4(),
      title: `List ${data.length + 1}`,
      tasks: [],
    };

    setData([...data, newList]);
  };

  const handleAddTask = (listIndex) => {
    const newTask = {
      id: uuidv4(),
      name: newTaskName,
      completed: false,
    };

    const newList = {
      ...data[listIndex],
      tasks: [...data[listIndex].tasks, newTask],
    };

    const newData = data.map((list, i) => (i === listIndex ? newList : list));

    setData(newData);
    setNewTaskName('');
  };

  const handleEditTask = (taskId, taskName) => {
    setEditTaskId(taskId);
    setEditTaskName(taskName);
  };

  const handleSaveTaskName = (listIndex, taskId) => {
    const newList = {
      ...data[listIndex],
      tasks: data[listIndex].tasks.map((task) =>
        task.id === taskId ? { ...task, name: editTaskName } : task
      ),
    };

    const newData = data.map((list, i) => (i === listIndex ? newList : list));

    setData(newData);
    setEditTaskId(null);
    setEditTaskName('');
  };

  const handleTaskCompletion = (listIndex, taskId) => {
    const newList = {
      ...data[listIndex],
      tasks: data[listIndex].tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    };

    const newData = data.map((list, i) => (i === listIndex ? newList : list));

    setData(newData);
  };

  const handleRemoveCompletedTasks = (listIndex) => {
    const newList = {
      ...data[listIndex],
      tasks: data[listIndex].tasks.filter((task) => !task.completed),
    };

    const newData = data.map((list, i) => (i === listIndex ? newList : list));

    setData(newData);
  };

  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.find((list) => list.id === source.droppableId);
    const finish = data.find((list) => list.id === destination.droppableId);

    if (start === finish) {
        const newTasks = Array.from(start.tasks);
        const [removed] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, removed);
  
        const newList = {
          ...start,
          tasks: newTasks,
        };
  
        const newData = data.map((list) =>
          list.id === source.droppableId ? newList : list
        );
  
        setData(newData);
        return;
      }
  
      // Moving from one list to another
      const startTasks = Array.from(start.tasks);
      const task = startTasks[source.index];
      startTasks.splice(source.index, 1);
      const newStart = {
        ...start,
        tasks: startTasks,
      };
  
      const finishTasks = Array.from(finish.tasks);
      finishTasks.splice(destination.index, 0, task);
      const newFinish = {
        ...finish,
        tasks: finishTasks,
      };
  
      const newData = data.map((list) =>
        list.id === start.id ? newStart : list.id === finish.id ? newFinish : list
      );
  
      setData(newData);
    };
  
    return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
          {data.map((list, i) => (
            <Droppable droppableId={list.id} key={list.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ margin: '1rem' }}
                >
                  <h2>{list.title}</h2>
                  {list.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            border: '1px solid black',
                            padding: '1rem',
                            marginBottom: '1rem',
                            textDecoration: task.completed ? 'line-through' : 'none',
                          }}
                        >
                          {editTaskId === task.id ? (
                            <div>
                              <TextField
                                value={editTaskName}
                                onChange={(e) => setEditTaskName(e.target.value)}
                              />
                              <Button onClick={() => handleSaveTaskName(i, task.id)}>
                                Save
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleTaskCompletion(i, task.id)}
                              />
                              {task.name}
                              <Button onClick={() => handleEditTask(task.id, task.name)}>
                                Edit
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <TextField
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="New task name"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddTask(i)}
                  >
                    Add Task
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveCompletedTasks(i)}
                  >
                    Remove Completed Tasks
                  </Button>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <Button variant="contained" color="primary" onClick={handleAddList}>
          Add List
        </Button>
      </div>
    </DragDropContext>
  );
};

export default DataForm;

  
