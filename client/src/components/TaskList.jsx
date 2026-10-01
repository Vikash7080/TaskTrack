import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { ClipboardList, GripVertical } from "lucide-react";
import "@fontsource-variable/plus-jakarta-sans";

import TaskItem from "./TaskItem";

function TaskList({
  filteredTasks,
  handleToggle,
  handleImportant,
  handleEdit,
  handleDelete,
  handleDragEnd,
}) {
  /* ---------- Empty state ---------- */
  if (filteredTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          fontFamily:
            "'Plus Jakarta Sans Variable', system-ui, sans-serif",
        }}
        className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <ClipboardList size={24} />
        </span>

        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No tasks to show
        </h3>

        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Add a task using the form above, or change the filter to see your
          other tasks.
        </p>
      </motion.div>
    );
  }

  return (
    <div
      style={{
        fontFamily:
          "'Plus Jakarta Sans Variable', system-ui, sans-serif",
      }}
    >
      {/* Summary + hint */}
      <div className="mb-4 flex items-center justify-between gap-3 text-sm">
        <p className="font-semibold text-slate-900">
          {filteredTasks.length}{" "}
          {filteredTasks.length === 1 ? "task" : "tasks"}
        </p>

        {filteredTasks.length > 1 && (
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <GripVertical size={14} className="text-slate-400" />
            Drag a task to change its order
          </p>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredTasks.map((task, index) => (
                <Draggable
                  key={task._id}
                  draggableId={task._id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="pb-4 outline-none"
                    >
                      <div
                        className={`transition-all duration-150 ${
                          snapshot.isDragging
                            ? "rotate-[0.8deg] scale-[1.015] cursor-grabbing drop-shadow-2xl"
                            : "cursor-grab"
                        }`}
                      >
                        <TaskItem
                          task={task}
                          handleToggle={handleToggle}
                          handleImportant={handleImportant}
                          handleEdit={handleEdit}
                          handleDelete={handleDelete}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default TaskList;