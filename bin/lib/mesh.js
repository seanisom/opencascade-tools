export function triangulate(oc, doc, linDeflection, isRelative, angDeflection, isInParallel) {
    if (linDeflection === void 0) { linDeflection = 0.1; }
    if (isRelative === void 0) { isRelative = false; }
    if (angDeflection === void 0) { angDeflection = 0.1; }
    if (isInParallel === void 0) { isInParallel = false; }
    console.log("> Triangulating shapes");
    console.debug("  > Creating tool");
    var tool = oc.XCAFDoc_DocumentTool.ShapeTool(doc.Main()).get();
    console.debug("  > Creating builder");
    var builder = new oc.BRep_Builder();
    console.debug("  > Creating compound");
    var compound = new oc.TopoDS_Compound();
    console.debug("  > Making compound");
    builder.MakeCompound(compound);
    console.debug("  > Creating sequence");
    var sequence = new oc.TDF_LabelSequence_1();
    console.debug("  > Getting shapes");
    tool.GetFreeShapes(sequence);
    console.debug("  > Getting labels");
    for (var index = sequence.Lower(); index <= sequence.Upper(); index++) {
        console.debug("    > Getting label");
        var label = sequence.Value(index);
        console.debug("    > Getting shape");
        var shape = oc.XCAFDoc_ShapeTool.GetShape_2(label);
        if (shape) {
            console.debug("    > Adding shape");
            builder.Add(compound, shape);
        }
    }
    console.debug("  > Creating algorithm");
    new oc.BRepMesh_IncrementalMesh_2(compound, linDeflection, isRelative, angDeflection, isInParallel);
    return doc;
}
