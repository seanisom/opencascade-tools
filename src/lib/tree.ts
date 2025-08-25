import { OpenCascadeInstance, TCollection_ExtendedString, TDataStd_Name, TDF_Label, TDocStd_Document, TopoDS_Shape, XCAFDoc_ShapeTool } from "opencascade.js"

function printShape(oc: OpenCascadeInstance, shape: TopoDS_Shape, level: string = ">", indent: number = 0) {
    switch (shape.ShapeType()) {
        case oc.TopAbs_ShapeEnum.TopAbs_COMPOUND:
            console.debug(level + " compound".padStart(indent + 1, " "))
            break
        case oc.TopAbs_ShapeEnum.TopAbs_COMPSOLID:
            console.debug(level + " compsolid".padStart(indent + 1, " "))
            break
        case oc.TopAbs_ShapeEnum.TopAbs_EDGE:
            console.debug(level + " edge".padStart(indent + 1, " "))
            break
        case oc.TopAbs_ShapeEnum.TopAbs_FACE:
            console.debug(level + " face".padStart(indent + 1, " "))
            break
        case oc.TopAbs_ShapeEnum.TopAbs_SHAPE:
            console.debug(level + " shape".padStart(indent + 1, " "))
            break
        case oc.TopAbs_ShapeEnum.TopAbs_SHELL:
            console.debug(level + " shell".padStart(indent + 1, " "))
            break
        case oc.TopAbs_ShapeEnum.TopAbs_SOLID:
            console.debug(level + " solid".padStart(indent + 1, " "))
            break
        case oc.TopAbs_ShapeEnum.TopAbs_VERTEX:
            console.debug(level + " vertex".padStart(indent + 1, " "))
            break
        case oc.TopAbs_ShapeEnum.TopAbs_WIRE:
            console.debug(level + " wire".padStart(indent + 1, " "))
            break
        default:
            console.debug(level + "  + default".padStart(indent + 1, " "))
    }
}

export function print(oc: OpenCascadeInstance, doc: TDocStd_Document) {
    console.debug("> Printing labels")

    console.debug("  > Creating tool")
    const tool = oc.XCAFDoc_DocumentTool.ShapeTool(doc.Main()).get()

    console.debug("  > Creating sequence")
    const sequence = new oc.TDF_LabelSequence_1()

    console.debug("  > Getting shapes")
    tool.GetFreeShapes(sequence)

    console.debug("  > Getting labels")
    const holes: any[] = []
    let refCounter = 1
    for (var index = sequence.Lower(); index <= sequence.Upper(); index++) {
        console.debug("    > Getting label")
        const label = sequence.Value(index)

        traverse(oc, label)

        const shape = oc.XCAFDoc_ShapeTool.GetShape_2(label)
        const iterator = new oc.TopoDS_Iterator_2(shape, true, true); 
        for (; iterator.More(); iterator.Next()) {
            //let label2 : TDF_Label = new oc.TDF_Label();

            const subShape = iterator.Value()
            //printShape(oc, subShape, "+", 2)

            const iterator2 = new oc.TopoDS_Iterator_2(subShape, true, true); 
            for (; iterator2.More(); iterator2.Next()) {
                const subShape2 = iterator2.Value()
                //printShape(oc, subShape2, "@@", 4)

                const iterator3 = new oc.TopoDS_Iterator_2(subShape2, true, true); 
                for (; iterator3.More(); iterator3.Next()) {
                    const subShape3 = iterator3.Value()
                    //printShape(oc, subShape3, "###", 6)

                    const iterator4 = new oc.TopoDS_Iterator_2(subShape3, true, true); 
                    for (; iterator4.More(); iterator4.Next()) {
                        const subShape4 = iterator4.Value()
                        //printShape(oc, subShape4, "***", 8)

                        if (subShape4.ShapeType() === oc.TopAbs_ShapeEnum.TopAbs_EDGE) {
                            const edge = oc.TopoDS.Edge_1(subShape4)
                            const isGeometric = oc.BRep_Tool.IsGeometric_2(edge)
                            const isDegenerated = oc.BRep_Tool.Degenerated(edge)
                            const tolerance = oc.BRep_Tool.Tolerance_2(edge)
                            const sameParameter = oc.BRep_Tool.SameParameter(edge)
                            const sameRange = oc.BRep_Tool.SameRange(edge)

                            const adaptor = new oc.BRepAdaptor_Curve_2(edge)
                            const uFirst = adaptor.FirstParameter()
                            const uLast = adaptor.LastParameter()
                            const isClosed = adaptor.IsClosed()
                            const curveType = adaptor.GetType()
                            const isCircle = curveType === oc.GeomAbs_CurveType.GeomAbs_Circle
                            let circleRadius: number | null = null
                            let circleCenter: number[] | null = null
                            let circleNormal: number[] | null = null
                            let circleXDir: number[] | null = null
                            let circleYDir: number[] | null = null
                            let circleQuat: number[] | null = null
                            if (isCircle) {
                                const circ = adaptor.Circle()
                                circleRadius = circ.Radius()
                                const center = circ.Location()
                                circleCenter = [center.X(), center.Y(), center.Z()]
                                const ax2 = circ.Position()
                                const n = ax2.Direction()
                                const xd = ax2.XDirection()
                                const yd = ax2.YDirection()
                                circleNormal = [n.X(), n.Y(), n.Z()]
                                circleXDir = [xd.X(), xd.Y(), xd.Z()]
                                circleYDir = [yd.X(), yd.Y(), yd.Z()]
                                const mat = new oc.gp_Mat_3(xd.XYZ(), yd.XYZ(), n.XYZ())
                                const q = new oc.gp_Quaternion_6(mat)
                                circleQuat = [q.X(), q.Y(), q.Z(), q.W()]
                            }

                            let pFirst: any = null
                            let pLast: any = null
                            try {
                                pFirst = adaptor.Value(uFirst)
                                pLast = adaptor.Value(uLast)
                            } catch (e) {
                                // ignore point sampling errors
                            }

                            const loc = new oc.TopLoc_Location_1()
                            const poly3d = oc.BRep_Tool.Polygon3D(edge, loc)
                            const hasPoly3d = poly3d && !poly3d.IsNull()

                            //if (isCircle && isClosed) {
                            if (isCircle) {
                                const tag = `ref_${refCounter++}`
                                const quat = circleQuat
                                    ? { w: circleQuat[3], x: circleQuat[0], y: circleQuat[1], z: circleQuat[2] }
                                    : { w: 1, x: 0, y: 0, z: 0 }
                                const pos = circleCenter
                                    ? { x: circleCenter[0] / 1000.0, y: circleCenter[1] / 1000.0, z: circleCenter[2] / 1000.0 }
                                    : { x: 0, y: 0, z: 0 }

                                holes.push({
                                    tag,
                                    transform: {
                                        quat,
                                        pos,
                                        order: ""
                                    },
                                    parameters: {
                                        radius: circleRadius / 1000.0,
                                        isClosed,
                                        uFirst,
                                        uLast
                                    }
                                })
                            }

                            if (isCircle) {
                                console.debug("EDGE:", {
                                    isGeometric,
                                    isDegenerated,
                                    tolerance,
                                    sameParameter,
                                    sameRange,
                                    isClosed,
                                    isCircle,
                                    circleRadius,
                                    circleCenter,
                                    circleNormal,
                                    circleXDir,
                                    circleYDir,
                                    circleQuat,
                                    uFirst,
                                    uLast,
                                    pFirst: pFirst ? [pFirst.X(), pFirst.Y(), pFirst.Z()] : null,
                                    pLast: pLast ? [pLast.X(), pLast.Y(), pLast.Z()] : null,
                                    hasPoly3d
                                })
                            }
                        }

                        
                        // Vertex
                        /*
                        const iterator5 = new oc.TopoDS_Iterator_2(subShape4, true, true); 
                        for (; iterator5.More(); iterator5.Next()) {
                            const subShape5 = iterator5.Value()
                            printShape(oc, subShape5, "%%%%%", 10)

                            const pnt = oc.BRep_Tool.Pnt(oc.TopoDS.Vertex_1(subShape5));
                            console.debug(pnt.X(), pnt.Y(), pnt.Z())
                        }
                            */
                    }
                }
            }
            //const success = tool.FindSubShape(label, subShape, label2);

            //traverse(oc, label2)
        }
    }
    // Emit the required JSON structure
    const result = {
        structure: [
            {
                Tag: "root",
                Children: [
                    { Tag: "Ī" }
                ]
            }
        ],
        part_reports: {
            root: {
                tag: "root",
                holes
            }
        }
    }
    console.log(JSON.stringify(result, null, 2))
}

function traverse(oc: OpenCascadeInstance, label: TDF_Label) {
    const shape = oc.XCAFDoc_ShapeTool.GetShape_2(label)

    console.debug("> traverse")

    switch (shape.ShapeType()) {
        case oc.TopAbs_ShapeEnum.TopAbs_COMPOUND:
            console.debug("  > compound")
            break
        case oc.TopAbs_ShapeEnum.TopAbs_COMPSOLID:
            console.debug("  > compsolid")
            break
        case oc.TopAbs_ShapeEnum.TopAbs_EDGE:
            console.debug("  > edge")
            break
        case oc.TopAbs_ShapeEnum.TopAbs_FACE:
            console.debug("  > face")
            break
        case oc.TopAbs_ShapeEnum.TopAbs_SHAPE:
            console.debug("  > shape")
            break
        case oc.TopAbs_ShapeEnum.TopAbs_SHELL:
            console.debug("  > shell")
            break
        case oc.TopAbs_ShapeEnum.TopAbs_SOLID:
            console.debug("  > solid")
            break
        case oc.TopAbs_ShapeEnum.TopAbs_VERTEX:
            console.debug("  > vertex")
            break
        case oc.TopAbs_ShapeEnum.TopAbs_WIRE:
            console.debug("  > wire")
            break
        default:
            console.debug("  > default")
    }

    if (oc.XCAFDoc_ShapeTool.IsAssembly(label)) {
        console.debug("  > assembly")
        for (const iterator = new oc.TDF_ChildIterator_2(label, false); iterator.More(); iterator.Next()) {
            traverse(oc, iterator.Value())
        }
    } else if (oc.XCAFDoc_ShapeTool.IsComponent(label)) {
        console.debug("  > component")
    } else if (oc.XCAFDoc_ShapeTool.IsCompound(label)) {
        console.debug("  > compound")
    } else if (oc.XCAFDoc_ShapeTool.IsSimpleShape(label)) {
        console.debug("  > simple shape")
    } else if (oc.XCAFDoc_ShapeTool.IsShape(label)) {
        console.debug("  > shape")
    } else {
        console.debug("  > other")            
    }

    //console.debug(shape.NbChildren());



    //shape.DumpJson(console.debug, -1);
}