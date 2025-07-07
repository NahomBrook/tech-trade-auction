import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RRule } from 'rrule';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { debounce } from 'lodash';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import rrulePlugin from '@fullcalendar/rrule';
import { Box, Modal, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Tooltip, Fade, Paper, Link } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import './Calendar.css';

dayjs.extend(utc);
dayjs.extend(timezone);

// Generate a unique ID for events and tasks
const generateId = () => uuidv4();

interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date (e.g., "2025-07-01T00:00:00Z")
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  description?: string;
  rrule?: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  description?: string;
  color?: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    const parsedEvents = savedEvents ? JSON.parse(savedEvents) : [];
    return parsedEvents.length > 0
      ? parsedEvents.map((event: any) => ({
          ...event,
          id: event.id || generateId(),
          backgroundColor: event.backgroundColor || '#0288d1',
          borderColor: event.backgroundColor || '#0288d1',
          textColor: '#ffffff',
          description: event.description || '',
          rrule: typeof event.rrule === 'string' && event.rrule !== '' ? event.rrule : undefined,
          start: event.start ? (typeof event.start === 'string' ? event.start : dayjs(event.start).tz('UTC').format('YYYY-MM-DD[T00:00:00Z]')) : '2025-07-01T00:00:00Z',
        }))
      : [{ id: generateId(), title: 'Sample Event', start: '2025-07-01T00:00:00Z', backgroundColor: '#0288d1', borderColor: '#0288d1', textColor: '#ffffff', description: 'Sample description' }];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('calendarTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [openEventModal, setOpenEventModal] = useState<boolean>(false);
  const [openTaskModal, setOpenTaskModal] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [deleteType, setDeleteType] = useState<'event' | 'task' | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventColor, setEventColor] = useState<string>('#0288d1');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventRecurrence, setEventRecurrence] = useState<string>('none');
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [taskStatus, setTaskStatus] = useState<string>('Todo');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskColor, setTaskColor] = useState<string>('#d32f2f');
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Save events and tasks to localStorage with debounce
  const saveEvents = debounce((events: CalendarEvent[]) => {
    console.log('Saving events to localStorage:', events);
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, 500);

  const saveTasks = debounce((tasks: Task[]) => {
    console.log('Saving tasks to localStorage:', tasks);
    localStorage.setItem('calendarTasks', JSON.stringify(tasks));
  }, 500);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const getRRuleString = (recurrence: string, startDate: string) => {
    if (recurrence === 'none' || !startDate) {
      console.log('No recurrence applied:', { recurrence, startDate });
      return undefined;
    }
    const start = dayjs(`${startDate}T00:00:00Z`).tz('UTC').toDate();
    if (!dayjs(start).isValid()) {
      console.log('Invalid start date for RRule:', { startDate });
      return undefined;
    }
    const rule = new RRule({
      freq: recurrence === 'daily' ? RRule.DAILY : RRule.WEEKLY,
      dtstart: start,
      until: dayjs(start).add(1, 'year').toDate(),
    });
    const rruleString = rule.toString();
    console.log('Generated RRule:', rruleString);
    return rruleString;
  };

  const handleDateClick = (arg: { dateStr: string }) => {
    console.log('Date clicked:', arg.dateStr);
    setSelectedDate(arg.dateStr);
    setEventTitle('');
    setEventColor('#0288d1');
    setEventDescription('');
    setEventRecurrence('none');
    setEditEvent(null);
    setOpenEventModal(true);
  };

  const handleEventClick = (arg: any) => {
    if (arg.event.id.startsWith('task-')) {
      const taskId = arg.event.id.replace('task-', '');
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        console.log('Task clicked:', task);
        setEditTask(task);
        setTaskTitle(task.title);
        setTaskDueDate(task.dueDate);
        setTaskStatus(task.status);
        setTaskDescription(task.description || '');
        setTaskColor(task.color || '#d32f2f');
        setOpenTaskModal(true);
      }
      return;
    }
    const event: CalendarEvent = {
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.startStr,
      backgroundColor: arg.event.backgroundColor || arg.event.extendedProps.backgroundColor || '#0288d1',
      borderColor: arg.event.backgroundColor || arg.event.extendedProps.backgroundColor || '#0288d1',
      textColor: '#ffffff',
      description: arg.event.extendedProps?.description || '',
      rrule: arg.event.extendedProps?.rrule ? String(arg.event.extendedProps.rrule) : undefined,
    };
    console.log('Event clicked:', event);
    handleEditEvent(event);
  };

  const confirmDelete = () => {
    if (deleteType === 'event' && eventToDelete) {
      console.log('Deleting event with ID:', eventToDelete);
      setEvents(events.filter((e) => e.id !== eventToDelete));
    } else if (deleteType === 'task' && taskToDelete) {
      console.log('Deleting task with ID:', taskToDelete);
      setTasks(tasks.filter((t) => t.id !== taskToDelete));
    }
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
    setTaskToDelete(null);
    setDeleteType(null);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    console.log('Opening event edit modal:', event);
    setEditEvent(event);
    setEventTitle(event.title);
    setEventColor(event.backgroundColor || '#0288d1');
    setEventDescription(event.description || '');
    setEventRecurrence(event.rrule ? event.rrule.split('FREQ=')[1]?.split(';')[0].toLowerCase() || 'none' : 'none');
    setSelectedDate(dayjs(event.start).tz('UTC').format('YYYY-MM-DD'));
    setOpenEventModal(true);
  };

  const handleEditTask = (task: Task) => {
    console.log('Opening task edit modal:', task);
    setEditTask(task);
    setTaskTitle(task.title);
    setTaskDueDate(task.dueDate);
    setTaskStatus(task.status);
    setTaskDescription(task.description || '');
    setTaskColor(task.color || '#d32f2f');
    setOpenTaskModal(true);
  };

  const handleEventDrop = (arg: any) => {
    const newStart = dayjs(arg.event.startStr).tz('UTC').format('YYYY-MM-DD[T00:00:00Z]');
    if (arg.event.id.startsWith('task-')) {
      const taskId = arg.event.id.replace('task-', '');
      console.log('Task dragged:', { taskId, newStart });
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, dueDate: dayjs(newStart).format('YYYY-MM-DD') } : task)));
      return;
    }
    const updatedEvent: CalendarEvent = {
      id: arg.event.id,
      title: arg.event.title,
      start: newStart,
      backgroundColor: arg.event.backgroundColor || arg.event.extendedProps.backgroundColor || '#0288d1',
      borderColor: arg.event.backgroundColor || arg.event.extendedProps.backgroundColor || '#0288d1',
      textColor: '#ffffff',
      description: arg.event.extendedProps?.description || '',
      rrule: arg.event.extendedProps?.rrule ? String(arg.event.extendedProps.rrule) : undefined,
    };
    console.log('Event dropped:', updatedEvent);
    setEvents(events.map((event) => (event.id === arg.event.id ? updatedEvent : event)));
  };

  const handleAddOrEditEvent = () => {
    if (!eventTitle.trim() || !selectedDate) {
      alert('Please enter a valid title and date.');
      console.log('Cannot add/edit event: Invalid input', { eventTitle, selectedDate });
      return;
    }
    const startDateTime = dayjs(`${selectedDate}T00:00:00Z`).tz('UTC');
    if (!startDateTime.isValid()) {
      alert('Invalid date format.');
      console.log('Invalid start date:', { selectedDate });
      return;
    }
    const start = startDateTime.format('YYYY-MM-DD[T00:00:00Z]');
    const newEvent: CalendarEvent = {
      id: editEvent ? editEvent.id : generateId(),
      title: eventTitle,
      start,
      backgroundColor: eventColor,
      borderColor: eventColor,
      textColor: '#ffffff',
      description: eventDescription,
      rrule: eventRecurrence !== 'none' ? getRRuleString(eventRecurrence, selectedDate) : undefined,
    };
    console.log('New/Edited event:', newEvent);
    if (editEvent) {
      console.log('Editing event:', newEvent);
      setEvents(events.map((event) => (event.id === editEvent.id ? newEvent : event)));
    } else {
      console.log('Adding event:', newEvent);
      setEvents([...events, newEvent]);
    }
    setEventTitle('');
    setEventColor('#0288d1');
    setEventDescription('');
    setEventRecurrence('none');
    setEditEvent(null);
    setOpenEventModal(false);
  };

  const handleAddOrEditTask = () => {
    if (!taskTitle.trim() || !taskDueDate) {
      alert('Please enter a valid title and due date.');
      console.log('Cannot add/edit task: Invalid input', { taskTitle, taskDueDate });
      return;
    }
    const dueDateTime = dayjs(`${taskDueDate}T00:00:00Z`).tz('UTC');
    if (!dayjs(dueDateTime).isValid()) {
      alert('Invalid due date format.');
      console.log('Invalid due date:', { taskDueDate });
      return;
    }
    const newTask: Task = {
      id: editTask ? editTask.id : generateId(),
      title: taskTitle,
      dueDate: taskDueDate,
      status: taskStatus,
      description: taskDescription,
      color: taskColor,
    };
    console.log('New/Edited task:', newTask);
    if (editTask) {
      console.log('Editing task:', newTask);
      setTasks(tasks.map((task) => (task.id === editTask.id ? newTask : task)));
    } else {
      console.log('Adding task:', newTask);
      setTasks([...tasks, newTask]);
    }
    setTaskTitle('');
    setTaskDueDate('');
    setTaskStatus('Todo');
    setTaskDescription('');
    setTaskColor('#d32f2f');
    setEditTask(null);
    setOpenTaskModal(false);
  };

  const handleEventModalClose = () => {
    console.log('Closing event modal, editEvent:', editEvent);
    setEventTitle('');
    setEventColor('#0288d1');
    setEventDescription('');
    setEventRecurrence('none');
    setEditEvent(null);
    setOpenEventModal(false);
  };

  const handleTaskModalClose = () => {
    console.log('Closing task modal, editTask:', editTask);
    setTaskTitle('');
    setTaskDueDate('');
    setTaskStatus('Todo');
    setTaskDescription('');
    setTaskColor('#d32f2f');
    setEditTask(null);
    setOpenTaskModal(false);
  };

  const handleAddTask = () => {
    setTaskTitle('New Task');
    setTaskDueDate('2025-07-10');
    setTaskStatus('Todo');
    setTaskDescription('');
    setTaskColor('#d32f2f');
    setEditTask(null);
    setOpenTaskModal(true);
  };

  const taskEvents: CalendarEvent[] = tasks.map((task) => ({
    id: `task-${task.id}`,
    title: task.title,
    start: dayjs(task.dueDate).tz('UTC').format('YYYY-MM-DD[T00:00:00Z]'),
    backgroundColor: task.color || '#d32f2f',
    borderColor: task.color || '#d32f2f',
    textColor: '#ffffff',
    description: `Task: ${task.status}${task.description ? ` - ${task.description}` : ''}`,
  }));

  const allEvents = [...events, ...taskEvents];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure full height for footer positioning
        bgcolor: 'background.default',
        overflow: 'hidden',
        background: {
          xs: 'linear-gradient(180deg, #f5f5f5 0%, #d3d3d3 100%)', // Light mode gradient
          sm: 'linear-gradient(180deg, #f5f5f5 0%, #d3d3d3 100%)',
        },
        '@media (prefers-color-scheme: dark)': {
          background: 'linear-gradient(180deg, #333333 0%, #1e1e1e 100%)', // Dark mode gradient
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1, // Take up available space, pushing footer to bottom
          overflow: 'hidden',
        }}
      >
        {/* Sidebar */}
        <Paper
          elevation={3}
          sx={{
            width: { xs: 280, sm: 300 },
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            m: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 16px)', // Adjust for margins (8px top + bottom on xs)
            '@media (min-width: 600px)': {
              height: 'calc(100vh - 32px)', // Adjust for margins (16px top + bottom on sm)
            },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleAddTask}
              sx={{ width: '100%' }}
            >
              Add Task
            </Button>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              pr: 1, // Small padding for scrollbar
            }}
          >
            {tasks.map((task) => (
              <Paper
                key={task.id}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {task.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {task.dueDate} • {task.status}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
        {/* Calendar */}
        <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2 }, overflow: 'auto' }}>
          <Paper elevation={3} sx={{ borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin, rrulePlugin]}
              initialView="dayGridMonth"
              events={allEvents}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              eventDidMount={(info) => {
                // Ensure event colors are applied directly
                const event = info.event;
                const el = info.el;
                const bgColor = event.backgroundColor || event.extendedProps.backgroundColor || '#0288d1';
                const borderColor = event.borderColor || event.extendedProps.backgroundColor || '#0288d1';
                el.style.setProperty('--event-bg-color', bgColor);
                el.style.setProperty('--event-border-color', borderColor);
                console.log('Event rendered:', { id: event.id, backgroundColor: bgColor, borderColor });
              }}
              eventDataTransform={(event: any) => {
                const transformedEvent: CalendarEvent = {
                  ...event,
                  id: event.id || generateId(),
                  rrule: event.rrule ? String(event.rrule) : undefined,
                  start: event.start ? (typeof event.start === 'string' ? event.start : dayjs(event.start).tz('UTC').format('YYYY-MM-DD[T00:00:00Z]')) : '2025-07-01T00:00:00Z',
                  backgroundColor: event.backgroundColor || event.extendedProps?.backgroundColor || (event.id.startsWith('task-') ? '#d32f2f' : '#0288d1'),
                  borderColor: event.backgroundColor || event.extendedProps?.backgroundColor || (event.id.startsWith('task-') ? '#d32f2f' : '#0288d1'),
                  textColor: '#ffffff',
                };
                console.log('Transformed event:', transformedEvent);
                return transformedEvent;
              }}
              editable={true}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,multiMonthYear',
              }}
              height="auto"
              dayMaxEvents={true}
              views={{
                dayGridMonth: { dayMaxEvents: 3 },
                multiMonthYear: { multiMonthMaxMonths: 12, multiMonthMinWidth: 200 },
              }}
              eventContent={(arg) => (
                <Tooltip title={arg.event.extendedProps?.description || 'No description'}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
                    <EventIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'inherit' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {arg.event.title}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            />
          </Paper>
        </Box>
      </Box>
      {/* Footer */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
          bgcolor: '#20263e',
          textAlign: 'center',
          zIndex: 1100, // Below modals (1300) but above content
          transition: 'opacity 0.3s ease',
          '&:hover': {
            opacity: 0.95,
          },
        }}
        className="footer"
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: { xs: '#ffffff', '@media (prefers-color-scheme: dark)': '#cccccc' },
            }}
          >
            © 2025
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: { xs: '#ffffff', '@media (prefers-color-scheme: dark)': '#cccccc' },
            }}
          >
            Developed by
          </Typography>
          <Link
            href="https://t.me/Nahom_Biruk"
            target="_blank"
            rel="noopener"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: 'primary.main',
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
              '&:hover': {
                textDecoration: 'underline',
                transform: 'scale(1.05)',
              },
            }}
          >
            Nahom
          </Link>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: { xs: '#ffffff', '@media (prefers-color-scheme: dark)': '#cccccc' },
            }}
          >
            Follow me on
          </Typography>
          <Link
            href="https://t.me/cyber_Guardian5"
            target="_blank"
            rel="noopener"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: 'primary.main',
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
              '&:hover': {
                textDecoration: 'underline',
                transform: 'scale(1.05)',
              },
            }}
          >
            Telegram
          </Link>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: { xs: '#ffffff', '@media (prefers-color-scheme: dark)': '#cccccc' },
            }}
          >
            and
          </Typography>
          <Link
            href="https://x.com/its_me_nahom"
            target="_blank"
            rel="noopener"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: 'primary.main',
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
              '&:hover': {
                textDecoration: 'underline',
                transform: 'scale(1.05)',
              },
            }}
          >
            X
          </Link>
        </Box>
      </Box>
      {/* Event Modal */}
      <Modal
        open={openEventModal}
        onClose={handleEventModalClose}
        slots={{ backdrop: 'div' }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.2)', // Light mode
              '@media (prefers-color-scheme: dark)': {
                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark mode
              },
            },
          },
        }}
      >
        <Fade in={openEventModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400, md: 450 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: { xs: 2, sm: 3 },
              maxWidth: '90vw',
              zIndex: 1300,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="medium">
                {editEvent ? 'Edit Event' : 'Add Event'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Date: {selectedDate}
            </Typography>
            <TextField
              fullWidth
              label="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              variant="outlined"
              sx={{ mb: 2, '& .MuiInputBase-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              multiline
              rows={3}
              variant="outlined"
              sx={{ mb: 2, '& .MuiInputBase-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Event Color</InputLabel>
              <Select
                value={eventColor}
                onChange={(e) => setEventColor(e.target.value)}
                label="Event Color"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="#0288d1">Blue</MenuItem>
                <MenuItem value="#d32f2f">Red</MenuItem>
                <MenuItem value="#388e3c">Green</MenuItem>
                <MenuItem value="#f57c00">Orange</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Recurrence</InputLabel>
              <Select
                value={eventRecurrence}
                onChange={(e) => setEventRecurrence(e.target.value)}
                label="Recurrence"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleEventModalClose}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Cancel
              </Button>
              {editEvent && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setEventToDelete(editEvent.id);
                    setDeleteType('event');
                    setDeleteConfirmOpen(true);
                  }}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleAddOrEditEvent}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                {editEvent ? 'Save' : 'Add'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/* Task Modal */}
      <Modal
        open={openTaskModal}
        onClose={handleTaskModalClose}
        slots={{ backdrop: 'div' }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.2)', // Light mode
              '@media (prefers-color-scheme: dark)': {
                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark mode
              },
            },
          },
        }}
      >
        <Fade in={openTaskModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400, md: 450 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: { xs: 2, sm: 3 },
              maxWidth: '90vw',
              zIndex: 1300,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="medium">
                {editTask ? 'Edit Task' : 'Add Task'}
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              variant="outlined"
              sx={{ mb: 2, '& .MuiInputBase-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              variant="outlined"
              sx={{ mb: 2, '& .MuiInputBase-root': { borderRadius: 2 } }}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                label="Status"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="Todo">Todo</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              multiline
              rows={3}
              variant="outlined"
              sx={{ mb: 2, '& .MuiInputBase-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Task Color</InputLabel>
              <Select
                value={taskColor}
                onChange={(e) => setTaskColor(e.target.value)}
                label="Task Color"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="#d32f2f">Red</MenuItem>
                <MenuItem value="#0288d1">Blue</MenuItem>
                <MenuItem value="#388e3c">Green</MenuItem>
                <MenuItem value="#f57c00">Orange</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleTaskModalClose}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Cancel
              </Button>
              {editTask && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setTaskToDelete(editTask.id);
                    setDeleteType('task');
                    setDeleteConfirmOpen(true);
                  }}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleAddOrEditTask}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                {editTask ? 'Save' : 'Add'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        slots={{ backdrop: 'div' }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.2)', // Light mode
              '@media (prefers-color-scheme: dark)': {
                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark mode
              },
            },
          },
        }}
      >
        <Fade in={deleteConfirmOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              width: { xs: '90%', sm: 300 },
              zIndex: 1300,
            }}
          >
            <Typography variant="body1" mb={2}>
              Delete this {deleteType === 'event' ? 'event' : 'task'}?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setDeleteConfirmOpen(false)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={confirmDelete}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Calendar;