
library(Seurat)

readLoomToSeurat <- function(file){
  "
  This function takes in a loom file genereated by a python script (no dim reductions) and creates a seurat object.
  Dim reductions are taken from tsv files in the same folder as the loom file.
  
  Attributes
  ----------
  file: str
    path to loom file. Dim reductions have to be in the same folder as lom file and filename start by 'X_'.
  "
  
  loom <- Connect(filename = file, mode = "r")
  seurat <- as.Seurat(loom)
  
  # Add visualizations
  folder <- dirname(file)
  viz_filenames <-list.files(folder, pattern="^X_")
  
  for(i in 1:length(viz_filenames)){
    viz <- read.table(paste0(folder, "/",viz_filenames[i]), header = TRUE, row.names = 1)
    seurat@reductions[i] <- viz
    print(nrow(viz))
  }
  
  return(seurat)
}