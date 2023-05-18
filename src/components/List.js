import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const List = (props) => {
  return (
    <Droppable droppableId={props.list.id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
         {props.list.tasks.map((task, index) => (
    <Task key={task.id} task={task} index={index} />
))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default List;
