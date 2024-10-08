export const findById = (resources, id) => {
	if (!resources) return null
	return resources.find((r) => r.id === id)
}

export const upsert = (resources, resource) => {
	const index = resources.findIndex((p) => p.id === resource.id)
	if (resource.id && index !== -1) {
		resources[index] = resource
	} else {
		resources.push(resource)
	}
}
export const docToResource = (doc) => {
	if (typeof doc?.data !== 'function') return doc
	return { ...doc.data(), id: doc.id }
}

export const makeAppendChildToParentMutation = ({ parent, child }) => {
	return (state, { childId, parentId }) => {
		const resource = findById(state.items, parentId)
		if (!resource) {
			console.warn(`Appending ${child} to ${parent} failed`)
			return
		}
		resource[child] = resource[child] || []
		if (resource[child].includes(childId)) return
		resource[child].push(childId)
	}
}
