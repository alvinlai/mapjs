/*global beforeEach, content, describe, expect, it, jasmine, MAPJS*/
describe('MapModel', function () {
	'use strict';
	it('should be able to instantiate MapModel', function () {
		var layoutCalculator,
			underTest = new MAPJS.MapModel(layoutCalculator);
		expect(underTest).not.toBeUndefined();
	});
	describe('events dispatched by MapModel', function () {
		var underTest,
			anIdea,
			layoutBefore,
			layoutAfter;
		beforeEach(function () {
			var layoutCalculatorLayout = undefined,
				layoutCalculator = function () {
					return layoutCalculatorLayout;
				};
			layoutBefore = {
					nodes: {
						to_be_removed: {
							x: 10,
							y: 20,
							title: 'This node will be removed'
						},
						to_be_moved: {
							x: 50,
							y: 20,
							title: 'second'
						}
					}
				};
			layoutAfter = {
				nodes: {
					to_be_moved: {
						x: 49,
						y: 20,
						title: 'This node will be moved'
					},
					to_be_created: {
						x: 100,
						y: 200,
						title: 'This node will be created'
					}
				}
			};
			underTest = new MAPJS.MapModel(layoutCalculator),
			layoutCalculatorLayout = layoutBefore;
			anIdea = content({});
			underTest.setIdea(anIdea);
			layoutCalculatorLayout = layoutAfter;
		});
		it('should dispatch nodeCreated event when a node is created because idea is changed', function () {
			var nodeCreatedListener = jasmine.createSpy();
			underTest.addEventListener('nodeCreated', nodeCreatedListener);

			anIdea.dispatchEvent('changed', undefined);

			expect(nodeCreatedListener).toHaveBeenCalledWith(layoutAfter.nodes.to_be_created);
		});
		it('should dispatch nodeMoved event when a node is moved because idea is changed', function () {
			var nodeMovedListener = jasmine.createSpy();
			underTest.addEventListener('nodeMoved', nodeMovedListener);

			anIdea.dispatchEvent('changed', undefined);

			expect(nodeMovedListener).toHaveBeenCalledWith(layoutAfter.nodes.to_be_moved);
		});
		it('should dispatch nodeRemoved event when a node is removed because idea is changed', function () {
			var nodeRemovedListener = jasmine.createSpy();
			underTest.addEventListener('nodeRemoved', nodeRemovedListener);

			anIdea.dispatchEvent('changed', undefined);

			expect(nodeRemovedListener).toHaveBeenCalledWith(layoutBefore.nodes.to_be_removed);
		});
		it('should dispatch nodeSelectionChanged when a different node is selected', function () {
			var nodeSelectionChangedListener = jasmine.createSpy();
			underTest.addEventListener('nodeSelectionChanged', nodeSelectionChangedListener);

			underTest.selectNode(1);

			expect(nodeSelectionChangedListener).toHaveBeenCalledWith(1, true);
		});
		it('should dispatch nodeSelectionChanged when a different node is selected', function () {
			var nodeSelectionChangedListener = jasmine.createSpy();
			underTest.selectNode(1);
			underTest.addEventListener('nodeSelectionChanged', nodeSelectionChangedListener);

			underTest.selectNode(2);

			expect(nodeSelectionChangedListener).toHaveBeenCalledWith(1, false);
		});
	});
});