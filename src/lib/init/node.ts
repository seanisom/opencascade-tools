import initOpenCascade from 'opencascade.js/dist/node.js'

export async function init() {
    console.debug("Initializing WebAssembly version of OpenCASCADE Technology")

    const start = Date.now()

    const oc = await initOpenCascade()

    const end = Date.now()

    console.debug(`WebAssembly version of OpenCASCADE Technology initialized successfully in ${end - start} ms`)

    return oc
}