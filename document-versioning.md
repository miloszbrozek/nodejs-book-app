## Document versioning
Detail how you would store several versioned, text-based documents, and present a schema for your solution.

It should be able to show:
   - the document in its current state
   - the document at any point in its history
   - the changes made between two versions

Strive for disk space efficiency.

A: Disk and read efficiency are somewhat contradictory here. So I would create a solution somewhere in the middle. I would create 2 collections: current_versions and prev_versions.

current_versions:
- document_id (identifies a document)
- version_num (incremental version number)
- content (full document content)
- created_at (timestamp of creation)

prev_versions:
- document_id
- version_num
- content (full document content - this field would be filled only in some cases)
- diff_next (a representation of diffs that when applied to the next version's content would give us `content` field)
- created_at

Once the new version of the document gets created the current version would be moved from `current_versions` into `prev_versions`. Then in order to meet disk space requirements I would clean up `content` field in `prev_versions` collections.

Sample rules that could be applied to clean up the `content` field:
- the version is older than x days
- the document wasn't accessed for x days
- the diff is very small and retrieving the document state would be very quick while the document content's is big
- leave the content only for x versions into the past
- leave the full content for every n-th version

Picking the right rule depends largely on the use case and the disk constraints.