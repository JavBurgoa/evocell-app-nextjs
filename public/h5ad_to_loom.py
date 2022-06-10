import scanpy as sc
import pandas as pd
import numpy as np


def adataToLoom(file, save_folder = ""):
    """
    Formats adata to loom. Exports visualizations separately, otherwise it doesn't work well"""
    
    adata = sc.read_h5ad(file)
    
    ## First make sure that the visualizations are in list, tuple, numpy matrix, numpy ndarray or sparse matrix
    # for i in adata.obsm:
    #    adata.obsm[i] = adata.obsm[i].to_numpy()
    
    if save_folder == "":
        save_file = re.sub("h5ad$", "loom", file)
        save_folder = os.path.dirname(file)
    else:
        save_file = f"{save_folder}/{os.path.basename(file)}"
        save_file = re.sub("h5ad$", "loom", save_file)
    
    # Save visualizations
    for i in adata.obsm:
        if isinstance(adata.obsm[i], np.array):
            adata.obsm[i] = pd.DataFrame(adata.obsm[i])
            
        if isinstance(adata.obsm[i], pd.DataFrame):
            
            adata.obsm[i].to_csv(f"{save_folder}/{i}.tsv" , sep = "\t")
            print(f"{i} saved in {save_folder}")
            
        else:print("Dimensionality reductions were not saved because they have to be pd.DataFrames or np.array")
            

    # Save loom file
    adata.write_loom(save_file)
    print(f"adata saved in {save_file}")
    
    return
