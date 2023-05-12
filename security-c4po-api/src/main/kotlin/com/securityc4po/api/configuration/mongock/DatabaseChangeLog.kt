package com.securityc4po.api.configuration.mongock

import com.github.cloudyrock.mongock.ChangeLog
import com.github.cloudyrock.mongock.ChangeSet
import com.securityc4po.api.project.*
import java.time.Instant
import java.util.*


@ChangeLog
class DatabaseChangeLog {

    @ChangeSet(order = "001", id = "seedDatabase", author = "Cel")
    fun seedDatabase(projectRepository: ProjectRepository): Unit {
        val projectList: MutableList<ProjectEntity> = mutableListOf<ProjectEntity>()
        projectList.add(ProjectEntity(createNewProjectData("Juice Shop", "OWASP", "C4PO")))
        projectRepository.insert(projectList).subscribe()
    }

    private fun createNewProjectData(titleData: String, clientData: String, testerData: String): Project {
        return Project(
            id = UUID.randomUUID().toString(),
            client = clientData,
            title = titleData,
            createdAt = Instant.now().toString(),
            tester = testerData,
            summary = "",
            state = PentestState.NEW,
            version = "1.0",
            projectPentests = emptyList<ProjectPentest>(),
            createdBy = "f8aab31f-4925-4242-a6fa-f98135b4b032"
        )
    }

    /**
     * This method is mandatory even when transactions are enabled.
     * They are used in the undo operation and any other scenario where transactions are not an option.
     * However, note that when transactions are avialble and Mongock need to rollback, this method is ignored.
     */
/*    @RollbackExecution
    fun rollback() {
        mongoTemplate.deleteMany(Document())
    }*/
}
