import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '@material-ui/core';

const Task = (props) => {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {props.task.content}
        </Card>
      )}
    </Draggable>
  );
};

export default Task;
