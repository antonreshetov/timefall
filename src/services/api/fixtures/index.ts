import { api } from '../index'

export function seedDB() {
  const task1Id = api.addTask({ name: 'Side Project', folderId: '' })
  const task2Id = api.addTask({ name: 'Learning Vue', folderId: '' })
  const task3Id = api.addTask({ name: 'Email Marketing', folderId: '' })
  const task4Id = api.addTask({ name: 'Logo Design', folderId: '' })
  const task5Id = api.addTask({ name: 'Personal Blog', folderId: '' })

  const taskIds = [task1Id, task2Id, task3Id, task4Id, task5Id]

  Array(10)
    .fill(null)
    .forEach(() => {
      const recordId = api.addTaskRecord({
        taskId: taskIds[Math.floor(Math.random() * taskIds.length)],
      })

      api.updateTaskRecordDuration(recordId, Math.floor(Math.random() * 10000))
    })
}

seedDB()
