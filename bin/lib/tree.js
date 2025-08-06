export function print(oc, doc) {
    console.log("> Printing labels");
    console.debug("  > Creating tool");
    var tool = oc.XCAFDoc_DocumentTool.ShapeTool(doc.Main()).get();
    console.debug("  > Creating sequence");
    var sequence = new oc.TDF_LabelSequence_1();
    console.debug("  > Getting shapes");
    tool.GetFreeShapes(sequence);
    console.debug("  > Getting labels");
    for (var index = sequence.Lower(); index <= sequence.Upper(); index++) {
        console.debug("    > Getting label");
        var label = sequence.Value(index);
        traverse(oc, label);
    }
}
function traverse(oc, label) {
    var shape = oc.XCAFDoc_ShapeTool.GetShape_2(label);
    console.log("> traverse");
    switch (shape.ShapeType()) {
        case oc.TopAbs_ShapeEnum.TopAbs_COMPOUND:
            console.log("  > compound");
            break;
        case oc.TopAbs_ShapeEnum.TopAbs_COMPSOLID:
            console.log("  > compsolid");
            break;
        case oc.TopAbs_ShapeEnum.TopAbs_EDGE:
            console.log("  > edge");
            break;
        case oc.TopAbs_ShapeEnum.TopAbs_FACE:
            console.log("  > face");
            break;
        case oc.TopAbs_ShapeEnum.TopAbs_SHAPE:
            console.log("  > shape");
            break;
        case oc.TopAbs_ShapeEnum.TopAbs_SHELL:
            console.log("  > shell");
            break;
        case oc.TopAbs_ShapeEnum.TopAbs_SOLID:
            console.log("  > solid");
            break;
        case oc.TopAbs_ShapeEnum.TopAbs_VERTEX:
            console.log("  > vertex");
            break;
        case oc.TopAbs_ShapeEnum.TopAbs_WIRE:
            console.log("  > wire");
            break;
        default:
            console.log("  > default");
    }
    if (oc.XCAFDoc_ShapeTool.IsAssembly(label)) {
        console.log("  > assembly");
        for (var iterator = new oc.TDF_ChildIterator_2(label, false); iterator.More(); iterator.Next()) {
            traverse(oc, iterator.Value());
        }
    }
    else if (oc.XCAFDoc_ShapeTool.IsComponent(label)) {
        console.log("  > component");
    }
    else if (oc.XCAFDoc_ShapeTool.IsCompound(label)) {
        console.log("  > compound");
    }
    else if (oc.XCAFDoc_ShapeTool.IsSimpleShape(label)) {
        console.log("  > simple shape");
    }
    else if (oc.XCAFDoc_ShapeTool.IsShape(label)) {
        console.log("  > shape");
    }
    else {
        console.log("  > other");
    }
}
