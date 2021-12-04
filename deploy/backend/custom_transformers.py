from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd

# Transformador para selecionar as features de treinamento do modelo
class FeatureSelector(BaseEstimator, TransformerMixin):
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        X = pd.DataFrame(X).copy()
        X_new = X[['GS', 'PLAYER_AGE', 'FG_PCT', 'FG3A']]
        X_new['REB/MIN'] = X['REB'] / X['MIN'].apply(lambda x: 1 if x == 0 else x)
        X_new['AST/MIN'] = X['AST'] / X['MIN'].apply(lambda x: 1 if x == 0 else x)
        X_new['PTS/MIN'] = X['PTS'] / X['MIN'].apply(lambda x: 1 if x == 0 else x)
        return X_new