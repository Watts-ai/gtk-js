use relm4::prelude::*;

pub struct LevelbarContinuousFull;

#[relm4::component(pub)]
impl SimpleComponent for LevelbarContinuousFull {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::LevelBar {
            set_value: 1.0,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
