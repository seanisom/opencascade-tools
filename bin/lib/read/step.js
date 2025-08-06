var NAME = "file.stp";
var BASE = ".";
var PATH = "".concat(BASE, "/").concat(NAME);
export function readStepData(oc, data, docHandle) {
    if (docHandle === void 0) { docHandle = null; }
    console.log("> Reading STEP");
    console.debug("  > Creating reader");
    var reader = new oc.STEPCAFControl_Reader_1();
    console.debug("  > Creating file");
    oc.FS.createDataFile(BASE, NAME, data, true, true, true);
    console.debug("  > Reading file");
    var result = reader.ReadFile(PATH);
    console.debug("  > Deleting file");
    oc.FS.unlink(PATH);
    if (result != oc.IFSelect_ReturnStatus.IFSelect_RetDone) {
        throw 'Could not read STEP file';
    }
    if (docHandle == null) {
        console.debug("  > Creating format");
        var format = new oc.TCollection_ExtendedString_1();
        console.debug("  > Creating document");
        var doc = new oc.TDocStd_Document(format);
        console.debug("  > Creating handle");
        docHandle = new oc.Handle_TDocStd_Document_2(doc);
    }
    console.debug("  > Creating progress");
    var progress = new oc.Message_ProgressRange_1();
    console.debug("  > Transferring data");
    reader.Transfer_1(docHandle, progress);
    return docHandle;
}
